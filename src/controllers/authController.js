const authService = require("../services/authService");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/user");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000
});

const generateOTP = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

const hashOTP = (otp) => {
  return crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");
};

// ================= SIGNUP =================

const signup = async (req, res, next) => {
  try {
    const user = await authService.signup(req.body);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user
    });
  } catch (error) {
    next(error);
  }
};

// ================= LOGIN =================

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      ...result
    });
  } catch (error) {
    next(error);
  }
};

// ================= SEND REGISTRATION OTP =================

const sendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please signup first."
      });
    }

    const otp = generateOTP();

    user.otpHash = hashOTP(otp);
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    user.otpAttempts = 0;
    user.otpVerified = false;
    user.otpLastSentAt = new Date();

    await user.save();

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: normalizedEmail,
        subject: "Your Registration OTP",
        text: `Your OTP is ${otp}. It will expire in 5 minutes.`
      });
    } catch (mailError) {
      console.error("Nodemailer Error:", mailError);
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email. Please verify your SMTP credentials (like App Password) in the .env file."
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      test_otp: otp
    });
  } catch (error) {
    console.error("SEND OTP ERROR:", error);
    next(error);
  }
};

// ================= VERIFY REGISTRATION OTP =================

const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required"
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim()
    });

    if (!user || !user.otpHash) {
      return res.status(400).json({
        success: false,
        message: "Please request a new OTP"
      });
    }

    if (!user.otpExpires || user.otpExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired"
      });
    }

    if (user.otpAttempts >= 5) {
      return res.status(429).json({
        success: false,
        message: "Too many attempts. Please request a new OTP"
      });
    }

    if (hashOTP(otp) !== user.otpHash) {
      user.otpAttempts += 1;
      await user.save();

      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    user.otpVerified = true;
    user.otpHash = null;
    user.otpExpires = null;
    user.otpAttempts = 0;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully"
    });
  } catch (error) {
    next(error);
  }
};

// ================= FORGOT PASSWORD =================

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with this email does not exist. Please check for typos or sign up first."
      });
    }

    const otp = generateOTP();

    user.resetPasswordTokenHash = hashOTP(otp);
    user.resetPasswordExpiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    await user.save();

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: normalizedEmail,
        subject: "Password Reset OTP",
        text: `Your password reset OTP is ${otp}. It will expire in 10 minutes.`
      });
    } catch (mailError) {
      console.error("Nodemailer Error:", mailError);
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email. Please verify your SMTP credentials (like App Password) in the .env file."
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP has been generated successfully.",
      test_otp: otp
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    next(error);
  }
};

// ================= RESET PASSWORD =================

const resetPassword = async (req, res, next) => {
  try {
    const {
      email,
      otp,
      newPassword
    } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP and new password are required"
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail
    });

    if (!user || !user.resetPasswordTokenHash) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP"
      });
    }

    if (
      !user.resetPasswordExpiresAt ||
      user.resetPasswordExpiresAt < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please request a new OTP."
      });
    }

    const hashedOTP = hashOTP(otp);

    if (hashedOTP !== user.resetPasswordTokenHash) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    await authService.resetPassword(
      normalizedEmail,
      otp,
      newPassword
    );

    return res.status(200).json({
      success: true,
      message: "Password reset successfully"
    });
  } catch (error) {
    next(error);
  }
};

// ================= CHANGE PASSWORD =================

const changePassword = async (req, res, next) => {
  try {
    const {
      currentPassword,
      newPassword
    } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required"
      });
    }

    const userId = req.user.userId;

    await authService.changePassword(
      userId,
      currentPassword,
      newPassword
    );

    return res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  sendOTP,
  verifyOTP,
  forgotPassword,
  resetPassword,
  changePassword
};