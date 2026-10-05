const express = require("express");

const {
  signup,
  login,
  logout,
  sendOTP,
  verifyOTP,
  forgotPassword,
  resetPassword,
  changePassword
} = require("../controllers/authController");

const validate = require("../middleware/validate");

const {
  signupSchema,
  loginSchema
} = require("../validators/authValidator");

const { authLimiter } = require("../middleware/rateLimiter");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Signup
router.post(
  "/signup",
  authLimiter,
  validate(signupSchema),
  signup
);

// Login
router.post(
  "/login",
  authLimiter,
  validate(loginSchema),
  login
);

// Logout
router.post(
  "/logout",
  authLimiter,
  logout
);

// Registration OTP
router.post(
  "/send-otp",
  authLimiter,
  sendOTP
);

router.post(
  "/verify-otp",
  authLimiter,
  verifyOTP
);

// Forgot Password
router.post(
  "/forgot-password",
  authLimiter,
  forgotPassword
);

// Reset Password
router.post(
  "/reset-password",
  authLimiter,
  resetPassword
);

// Change Password
router.post(
  "/change-password",
  authMiddleware,
  changePassword
);

module.exports = router;