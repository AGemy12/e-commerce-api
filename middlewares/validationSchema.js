import { body } from "express-validator";

export const validationSchema = () => [
  body("title")
    .notEmpty()
    .withMessage("title is required")
    .isLength({ min: 2 })
    .withMessage("min length is 2 chars"),
  body("price")
    .notEmpty()
    .withMessage("price is required")
    .isNumeric()
    .withMessage("price must be a number"),
  body("description")
    .optional()
    .isLength({ min: 5 })
    .withMessage("description must be at least 5 chars"),
];
