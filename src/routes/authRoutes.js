const express = require("express");

const {
  signup,
  login
} = require("../controllers/authController");

const validate = require("../middleware/validate");

const {
  signupSchema,
  loginSchema
} = require("../validators/authValidator");

const { authLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

router.post(
  "/signup",
  authLimiter,
  validate(signupSchema),
  signup
);

router.post(
  "/login",
  authLimiter,
  validate(loginSchema),
  login
);

module.exports = router;