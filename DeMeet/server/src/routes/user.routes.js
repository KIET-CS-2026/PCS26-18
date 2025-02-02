import { Router } from "express";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const userRouter = Router();

userRouter
  .route("/register")
  .post(upload.fields([{ name: "avatar", maxCount: 1 }]), registerUser);

userRouter.route("/login").post(loginUser);

userRouter.route("/refreshAccess").post(refreshAccessToken);

export default userRouter;
