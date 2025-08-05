export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export const ERROR_MESSAGES = {
  VALIDATION_ERROR: "Validation failed",
  USER_NOT_FOUND: "User not found",
  USER_EXISTS: "User already exists",
  INVALID_CREDENTIALS: "Invalid credentials",
  UNAUTHORIZED: "Unauthorized access",
  TOKEN_EXPIRED: "Token expired",
  INTERNAL_ERROR: "Internal server error",
  FILE_UPLOAD_ERROR: "File upload failed",
};
