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
const sendOTP = async (req, res) => {
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

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: normalizedEmail,
      subject: "Your Registration OTP",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully"
    });

  } catch (error) {
    console.error("SEND OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

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

    if (user.otpExpires < new Date()) {
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

module.exports = {
  signup,
  login,
  sendOTP,
  verifyOTP
};