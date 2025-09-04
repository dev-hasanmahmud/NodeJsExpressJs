const { body } = require("express-validator");

exports.create = [
  body("first_name").notEmpty().withMessage("First name is required"),
  body("last_name").notEmpty().withMessage("Last name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
];

exports.update = [
  body("first_name").optional().notEmpty().withMessage("First name cannot be empty"),
  body("last_name").optional().notEmpty().withMessage("Last name cannot be empty"),
  body("email").optional().isEmail().withMessage("Valid email is required"),
];
