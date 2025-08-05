import { asyncHandler } from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import logger from "../utils/logger.js";
import * as jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { HTTP_STATUS, ERROR_MESSAGES } from "../constants/httpStatus.js";
import { UserService } from "../services/user.service.js";
import { UploadService } from "../services/upload.service.js";

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(HTTP_STATUS.OK)
    .json(
      new apiResponse(
        HTTP_STATUS.OK,
        { user: req.user },
        "Current user fetched successfully"
      )
    );
});



const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phoneNumber } = req.validatedData;

  const existedUser = await UserService.findByEmailOrPhone(email, phoneNumber);
  if (existedUser) {
    throw new apiError(HTTP_STATUS.CONFLICT, ERROR_MESSAGES.USER_EXISTS);
  }

  const avatarPath = req.files?.avatar?.[0]?.path;
  const avatar = await UploadService.uploadAvatar(avatarPath);

  const user = await UserService.createUser({
    name,
    email,
    password,
    phoneNumber,
    avatar,
  });

  if (!user) {
    throw new apiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "User registration failed"
    );
  }

  logger.info(`User created successfully with ID: ${user._id}`);

  return res
    .status(HTTP_STATUS.CREATED)
    .json(new apiResponse(HTTP_STATUS.CREATED, user, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.validatedData;
  const user = await UserService.findByEmail(email);
  
  if (!user) {
    throw new apiError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.USER_NOT_FOUND);
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new apiError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS);
  }

  const { accessToken, refreshToken } = await UserService.generateTokens(user._id);
  const loggedInUser = await UserService.findById(user._id);

  if (!loggedInUser) {
    throw new apiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Login failed"
    );
  }

  logger.info(`User logged in successfully with ID: ${user._id}`);

  return res
    .status(HTTP_STATUS.OK)
    .cookie("accessToken", accessToken, config.cookie)
    .cookie("refreshToken", refreshToken, config.cookie)
    .json(
      new apiResponse(
        HTTP_STATUS.OK,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new apiError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.UNAUTHORIZED);
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      config.jwt.refreshTokenSecret
    );

    const user = await UserService.findById(decodedToken?._id);
    if (!user) {
      throw new apiError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.TOKEN_EXPIRED);
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new apiError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.TOKEN_EXPIRED);
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await UserService.generateTokens(user._id);

    return res
      .status(HTTP_STATUS.OK)
      .cookie("accessToken", accessToken, config.cookie)
      .cookie("refreshToken", newRefreshToken, config.cookie)
      .json(
        new apiResponse(
          HTTP_STATUS.OK,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new apiError(
      HTTP_STATUS.UNAUTHORIZED,
      error?.message || ERROR_MESSAGES.TOKEN_EXPIRED
    );
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  await UserService.clearRefreshToken(req.user._id);

  return res
    .status(HTTP_STATUS.OK)
    .clearCookie("accessToken", config.cookie)
    .clearCookie("refreshToken", config.cookie)
    .json(new apiResponse(HTTP_STATUS.OK, {}, "User logged out successfully"));
});

export {
  getCurrentUser,
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
};
