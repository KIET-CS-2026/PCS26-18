import { body, param, query } from "express-validator";

export const createMeetingValidator = [
  body("title")
    .notEmpty()
    .withMessage("Meeting title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),
  
  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  
  body("type")
    .optional()
    .isIn(["web2", "solana"])
    .withMessage("Type must be either 'web2' or 'solana'"),
  
  body("isPublic")
    .optional()
    .isBoolean()
    .withMessage("isPublic must be a boolean"),
  
  body("isLocked")
    .optional()
    .isBoolean()
    .withMessage("isLocked must be a boolean"),
  
  body("maxParticipants")
    .optional()
    .isInt({ min: 2, max: 100 })
    .withMessage("Max participants must be between 2 and 100"),
  
  body("scheduledStartTime")
    .optional()
    .isISO8601()
    .withMessage("Scheduled start time must be a valid date")
    .custom((value) => {
      const scheduledTime = new Date(value);
      const now = new Date();
      // Allow times that are within 1 minute of now (for immediate meetings)
      if (scheduledTime < new Date(now.getTime() - 60000)) {
        throw new Error("Scheduled start time cannot be more than 1 minute in the past");
      }
      return true;
    }),
  
  body("scheduledEndTime")
    .optional()
    .isISO8601()
    .withMessage("Scheduled end time must be a valid date")
    .custom((value, { req }) => {
      const startTime = req.body.scheduledStartTime;
      if (startTime && new Date(value) <= new Date(startTime)) {
        throw new Error("Scheduled end time must be after start time");
      }
      return true;
    }),
  
  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array")
    .custom((tags) => {
      if (tags.length > 10) {
        throw new Error("Cannot have more than 10 tags");
      }
      return true;
    }),
  
  body("tags.*")
    .optional()
    .isString()
    .isLength({ min: 1, max: 20 })
    .withMessage("Each tag must be 1-20 characters long"),
];

export const updateMeetingValidator = [
  body("title")
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),
  
  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  
  body("isPublic")
    .optional()
    .isBoolean()
    .withMessage("isPublic must be a boolean"),
  
  body("isLocked")
    .optional()
    .isBoolean()
    .withMessage("isLocked must be a boolean"),
  
  body("maxParticipants")
    .optional()
    .isInt({ min: 2, max: 100 })
    .withMessage("Max participants must be between 2 and 100"),
  
  body("scheduledStartTime")
    .optional()
    .isISO8601()
    .withMessage("Scheduled start time must be a valid date"),
  
  body("scheduledEndTime")
    .optional()
    .isISO8601()
    .withMessage("Scheduled end time must be a valid date")
    .custom((value, { req }) => {
      const startTime = req.body.scheduledStartTime;
      if (startTime && new Date(value) <= new Date(startTime)) {
        throw new Error("Scheduled end time must be after start time");
      }
      return true;
    }),
  
  body("status")
    .optional()
    .isIn(["scheduled", "ongoing", "completed", "cancelled"])
    .withMessage("Status must be one of: scheduled, ongoing, completed, cancelled"),
  
  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array")
    .custom((tags) => {
      if (tags.length > 10) {
        throw new Error("Cannot have more than 10 tags");
      }
      return true;
    }),
  
  body("tags.*")
    .optional()
    .isString()
    .isLength({ min: 1, max: 20 })
    .withMessage("Each tag must be 1-20 characters long"),
];

export const roomIdValidator = [
  param("roomId")
    .notEmpty()
    .withMessage("Room ID is required")
    .isString()
    .withMessage("Room ID must be a string"),
];

export const paginationValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 and 50"),
];
