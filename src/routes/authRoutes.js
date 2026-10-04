const express = require("express");

const {
  signup,
  login,
  sendOTP,
  verifyOTP
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
router.post("/send-otp", authLimiter, sendOTP);
router.post("/verify-otp", authLimiter, verifyOTP);

module.exports = router;