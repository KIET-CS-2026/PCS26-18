import { asyncHandler } from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import apiResponse from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res, next) => {
  // get user details from frontend
  // validation - not empty and correct format
  // check if user already exist : Number and email
  // check for avatar
  // upload avatar to cloudinary
  // create user object - create entry in db
  // remove password and refresh token field free from response
  // check for user creation
  // return res

  const { name, email, password, number } = req.body;
  // console.log("email: ", email);

  if ([name, email, password, number].some((field) => field?.trim() === "")) {
    throw new apiError(400, "All fields are required");
  }

  const existedUser = User.findOne({ $or: [{ number }, { email }] });
  if (existedUser) {
    throw new apiError(409, "User with email or number already exist");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar is required");
  }

  const avatar = await uploadToCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new apiError(400, "Avatar upload error");
  }

  const user = await User.create({
    name,
    email,
    password,
    number,
    avatar: avatar.url,
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
