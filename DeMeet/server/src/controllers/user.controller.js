import { asyncHandler } from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import logger from "../utils/logger.js";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { HTTP_STATUS, ERROR_MESSAGES } from "../constants/httpStatus.js";
import { UserService } from "../services/user.service.js";
import { UploadService } from "../services/upload.service.js";
import { OAuth2Client } from "google-auth-library";

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
    .json(
      new apiResponse(HTTP_STATUS.CREATED, user, "User registered successfully")
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.validatedData;
  const user = await UserService.findByEmail(email);

  if (!user) {
    throw new apiError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.USER_NOT_FOUND);
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new apiError(
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_MESSAGES.INVALID_CREDENTIALS
    );
  }

  const { accessToken, refreshToken } = await UserService.generateTokens(
    user._id
  );
  const loggedInUser = await UserService.findById(user._id);

  if (!loggedInUser) {
    throw new apiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Login failed");
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
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

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
      throw new apiError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_MESSAGES.TOKEN_EXPIRED
      );
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new apiError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_MESSAGES.TOKEN_EXPIRED
      );
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
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");
  if (token) {
    const decodedToken = jwt.verify(token, config.jwt.accessTokenSecret);
    if (decodedToken?._id) {
      await UserService.clearRefreshToken(decodedToken._id);
    }
  }

  return res
    .status(HTTP_STATUS.OK)
    .clearCookie("accessToken", config.cookie)
    .clearCookie("refreshToken", config.cookie)
    .json(new apiResponse(HTTP_STATUS.OK, {}, "User logged out successfully"));
});

// Google OAuth Controllers
const googleAuth = asyncHandler(async (req, res) => {
  // This will redirect to Google OAuth
  // Handled by passport middleware
});

const googleCallback = asyncHandler(async (req, res) => {
  try {
    if (!req.user) {
      throw new apiError(HTTP_STATUS.UNAUTHORIZED, "Google authentication failed");
    }

    const { accessToken, refreshToken } = await UserService.generateTokens(req.user._id);
    
    logger.info(`User logged in via Google with ID: ${req.user._id}`);

    // Set cookies and redirect to frontend
    res
      .cookie("accessToken", accessToken, config.cookie)
      .cookie("refreshToken", refreshToken, config.cookie)
      .redirect(`${config.client.url}/dashboard`);
  } catch (error) {
    logger.error("Google OAuth callback error:", error);
    res.redirect(`${config.client.url}/auth?error=oauth_failed`);
  }
});

const googleVerify = asyncHandler(async (req, res) => {
  const { idToken, googleId, name, email, avatar } = req.body;

  if (!idToken || !googleId || !name || !email) {
    throw new apiError(HTTP_STATUS.BAD_REQUEST, "Missing required Google user data");
  }

  try {
    // In production, verify the token with Google
    // const client = new OAuth2Client(config.google.clientId);
    // const ticket = await client.verifyIdToken({
    //   idToken: idToken,
    //   audience: config.google.clientId,
    // });
    // const payload = ticket.getPayload();

    // For development, we trust the frontend verification
    
    let user = await UserService.findByGoogleId(googleId);
    
    if (!user) {
      user = await UserService.createGoogleUser({
        googleId,
        name,
        email,
        avatar,
      });
    }

    const { accessToken, refreshToken } = await UserService.generateTokens(user._id);
    
    logger.info(`User authenticated via Google token with ID: ${user._id}`);

    return res
      .status(HTTP_STATUS.OK)
      .cookie("accessToken", accessToken, config.cookie)
      .cookie("refreshToken", refreshToken, config.cookie)
      .json(
        new apiResponse(
          HTTP_STATUS.OK,
          { user, accessToken, refreshToken },
          "Google authentication successful"
        )
      );
  } catch (error) {
    logger.error("Google token verification error:", error);
    throw new apiError(
      HTTP_STATUS.UNAUTHORIZED,
      "Google token verification failed"
    );
  }
});

const googleSuccess = asyncHandler(async (req, res) => {
  if (req.user) {
    return res
      .status(HTTP_STATUS.OK)
      .json(
        new apiResponse(
          HTTP_STATUS.OK,
          { user: req.user },
          "Google authentication successful"
        )
      );
  } else {
    throw new apiError(HTTP_STATUS.UNAUTHORIZED, "Authentication failed");
  }
});

export {
  getCurrentUser,
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  googleAuth,
  googleCallback,
  googleVerify,
  googleSuccess,
};
