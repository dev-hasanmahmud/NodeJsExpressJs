const { body } = require("express-validator");

exports.create = [
  body("name")
    .notEmpty()
    .withMessage("Shift name is required"),

  body("startTime")
    .notEmpty()
    .withMessage("Start time is required")
    .isISO8601()
    .withMessage("Start time must be a valid date/time"),

  body("endTime")
    .notEmpty()
    .withMessage("End time is required")
    .isISO8601()
    .withMessage("End time must be a valid date/time"),

  body("lateGracePeriod")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Late grace period must be a non-negative integer (minutes)"),

  body("earlyLeaveGracePeriod")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Early leave grace period must be a non-negative integer (minutes)"),

  body("breakDuration")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Break duration must be a non-negative integer (minutes)")
];

exports.update = [
  body("name")
    .optional()
    .notEmpty()
    .withMessage("Shift name cannot be empty"),

  body("startTime")
    .optional()
    .isISO8601()
    .withMessage("Start time must be a valid date/time"),

  body("endTime")
    .optional()
    .isISO8601()
    .withMessage("End time must be a valid date/time"),

  body("lateGracePeriod")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Late grace period must be a non-negative integer (minutes)"),

  body("earlyLeaveGracePeriod")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Early leave grace period must be a non-negative integer (minutes)"),

  body("breakDuration")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Break duration must be a non-negative integer (minutes)")
];
