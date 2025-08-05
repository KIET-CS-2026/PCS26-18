import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import apiError from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { config } from "../config/index.js";
import { HTTP_STATUS, ERROR_MESSAGES } from "../constants/httpStatus.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new apiError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.UNAUTHORIZED);
    }

    const decodedToken = jwt.verify(token, config.jwt.accessTokenSecret);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new apiError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_MESSAGES.TOKEN_EXPIRED
      );
    }

    req.user = user;
    next();
  } catch (error) {
    throw new apiError(
      HTTP_STATUS.UNAUTHORIZED,
      error?.message || ERROR_MESSAGES.TOKEN_EXPIRED
    );
  }
});
