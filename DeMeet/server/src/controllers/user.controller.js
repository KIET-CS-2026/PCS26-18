import { asyncHandler } from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import apiResponse from "../utils/apiResponse.js";
import { z } from "zod";

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

  return res
    .status(201)
    .json(new apiResponse(200, findUser, "User Registered Successfully"));
});

export { registerUser };
