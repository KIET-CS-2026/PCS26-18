import { HTTP_STATUS, ERROR_MESSAGES } from "../constants/httpStatus.js";
import logger from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || ERROR_MESSAGES.INTERNAL_ERROR;

  logger.error(`Error ${statusCode}: ${message}`, {
    url: req.url,
    method: req.method,
    stack: err.stack,
  });

  res.status(statusCode).json({
    statusCode,
    success: false,
    message,
    data: null,
    errors: err.errors || [],
  });
};

export default errorHandler;
