import { Router } from "express";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getCurrentUser,
  googleAuth,
  googleCallback,
  googleVerify,
  googleSuccess,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { registerSchema, loginSchema } from "../validators/user.validator.js";
import passport from "../config/passport.js";

const userRouter = Router();

userRouter
  .route("/register")
  .post(
    upload.fields([{ name: "avatar", maxCount: 1 }]),
    validate(registerSchema),
    registerUser
  );
userRouter.route("/login").post(validate(loginSchema), loginUser);
userRouter.route("/refreshAccess").post(refreshAccessToken);
userRouter.route("/logout").post(logoutUser);

// Google OAuth Routes
userRouter
  .route("/auth/google")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }), googleAuth);

userRouter
  .route("/auth/google/callback")
  .get(passport.authenticate("google", { failureRedirect: "/auth" }), googleCallback);

userRouter.route("/auth/google/verify").post(googleVerify);
userRouter.route("/auth/google/success").get(verifyJWT, googleSuccess);

//Secured Routes
userRouter.route("/me").get(verifyJWT, getCurrentUser);

export default userRouter;
