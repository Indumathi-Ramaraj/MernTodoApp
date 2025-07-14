const { body } = require("express-validator");

exports.registerValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/)
    .withMessage(
      "Password must be at least 6 characters and include uppercase, lowercase, number, and special character"
    ),
];

exports.todoValidation = [
  body("toDoList")
    .isArray({ min: 1 })
    .withMessage("To-do list must be a non-empty array"),
];
