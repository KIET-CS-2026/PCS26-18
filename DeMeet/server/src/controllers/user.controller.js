import { asyncHandler } from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import apiResponse from "../utils/apiResponse.js";
import { z } from "zod";
import logger from "../utils/logger.js";
import * as jwt from "jsonwebtoken";

const options = {
  httpOnly: true, // Should be true in both dev and prod
  secure: process.env.ENVIRONMENT === "prod", // false in dev, true in prod
  sameSite: process.env.ENVIRONMENT === "prod" ? "none" : "lax", // "lax" is more appropriate for dev
};

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(
      500,
      "Something went wrong while generating access and refresh token"
    );
  }
};

const registerUser = asyncHandler(async (req, res, next) => {
  const userSchema = z.object({
    name: z.string().nonempty("Name is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().nonempty("Password is required"),
    phoneNumber: z.string().nonempty("Phone number is required"),
  });

  const validationResult = await userSchema.safeParse(req.body);
  if (!validationResult.success) {
    throw new apiError(400, validationResult.error.errors[0].message);
  }

  const { name, email, password, phoneNumber } = validationResult.data;

  const existedUser = await User.findOne({ $or: [{ phoneNumber }, { email }] });
  if (existedUser) {
    throw new apiError(409, "User with email or phoneNumber already exist !");
  }

  let avatar = null;
  const avatarLocalPath = req.files?.avatar?.[0]?.path;

  if (avatarLocalPath) {
    const uploadedAvatar = await uploadToCloudinary(avatarLocalPath);
    if (!uploadedAvatar) {
      throw new apiError(400, "Avatar upload error");
    }
    avatar = uploadedAvatar.url;
  }

  const user = await User.create({
    name,
    email,
    password,
    phoneNumber,
    avatar,
  });
  const findUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!findUser)
    throw new apiError(500, "Something went wrong while registering user");

  logger.info(`User created Successfully with Id ${user._id}`);

  return res
    .status(201)
    .json(new apiResponse(200, findUser, "User Registered Successfully"));
});

const loginUser = asyncHandler(async (req, res, next) => {
  const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().nonempty("Password is required"),
  });
  const validationResult = await loginSchema.safeParse(req.body);
  if (!validationResult.success) {
    throw new apiError(400, validationResult.error.errors[0].message);
  }
  const { email, password } = validationResult.data;
  const user = await User.findOne({ email });
  if (!user) {
    throw new apiError(404, "User does not exist");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new apiError(401, "Invalid user credentials");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!loggedInUser) {
    throw new apiError(500, "Something went wrong while logging in user");
  }

  logger.info(`User logged in Successfully with Id ${user._id}`);

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User Logged In Successfully"
      )
    );
});

const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new apiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new apiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new apiError(401, "Refresh token is expired or used");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new apiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new apiError(401, error?.message || "Invalid refresh token");
  }
});

const logoutUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "User logged out successfully"));
});

export { registerUser, loginUser, refreshAccessToken, logoutUser };
