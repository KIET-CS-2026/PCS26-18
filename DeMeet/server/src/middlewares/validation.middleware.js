import { validationResult } from "express-validator";
import apiError from "../utils/apiError.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";

export const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    if (Array.isArray(validations)) {
      await Promise.all(validations.map(validation => validation.run(req)));
    }

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array()[0];
      throw new apiError(
        HTTP_STATUS.BAD_REQUEST,
        `${firstError.path}: ${firstError.msg}`
      );
    }

    next();
  };
};
