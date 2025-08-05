import apiError from "../utils/apiError.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";

export const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      throw new apiError(
        HTTP_STATUS.BAD_REQUEST,
        result.error.errors[0].message
      );
    }
    req.validatedData = result.data;
    next();
  };
};
