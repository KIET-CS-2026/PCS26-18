import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";

const healthRouter = Router();

const healthCheck = asyncHandler(async (req, res) => {
  return res
    .status(HTTP_STATUS.OK)
    .json(
      new apiResponse(HTTP_STATUS.OK, { status: "OK" }, "Server is healthy")
    );
});

healthRouter.route("/").get(healthCheck);

export default healthRouter;
