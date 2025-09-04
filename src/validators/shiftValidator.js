// src/validators/shiftValidator.js
const { body } = require("express-validator");

exports.create = [
  body("name")
    .notEmpty()
    .withMessage("Shift name is required"),

  body("start_time")
    .notEmpty()
    .withMessage("Start time is required")
    .isISO8601()
    .withMessage("Start time must be a valid date/time"),

  body("end_time")
    .notEmpty()
    .withMessage("End time is required")
    .isISO8601()
    .withMessage("End time must be a valid date/time"),

  body("late_grace_period")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Late grace period must be a non-negative integer (minutes)"),

  body("early_leave_grace_period")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Early leave grace period must be a non-negative integer (minutes)"),

  body("break_duration")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Break duration must be a non-negative integer (minutes)")
];

exports.update = [
  body("name")
    .optional()
    .notEmpty()
    .withMessage("Shift name cannot be empty"),

  body("start_time")
    .optional()
    .isISO8601()
    .withMessage("Start time must be a valid date/time"),

  body("end_time")
    .optional()
    .isISO8601()
    .withMessage("End time must be a valid date/time"),

  body("late_grace_period")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Late grace period must be a non-negative integer (minutes)"),

  body("early_leave_grace_period")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Early leave grace period must be a non-negative integer (minutes)"),

  body("break_duration")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Break duration must be a non-negative integer (minutes)")
];
