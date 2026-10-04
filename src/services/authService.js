const crypto = require("crypto");
const argon2 = require("argon2");
const User = require("../models/user");
const RefreshToken = require("../models/RefreshToken");

const {
  createAccessToken,
  createRefreshToken,
  hashToken
} = require("../utils/token");

const signup = async ({ name, email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await User.findOne({
    email: normalizedEmail
  });

  if (existingUser) {
    const err = new Error("Email already registered");
    err.statusCode = 200;
    throw err;
  }

  const hashedPassword = await argon2.hash(password);

  const user = await User.create({
    name,
    email: normalizedEmail,
    password: hashedPassword
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };
};


const login = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({
    email: normalizedEmail
  });

  if (!user) {
    const err = new Error("Invalid email or password");
    err.statusCode = 401;
    throw err;
  }

  if (user.lockUntil && user.lockUntil > new Date()) {
    const err = new Error("Account temporarily locked");
    err.statusCode = 403;
    throw err;
  }

  const validPassword = await argon2.verify(
    user.password,
    password
  );

  if (!validPassword) {
    user.failedLoginAttempts += 1;

    if (user.failedLoginAttempts >= 5) {
      user.lockUntil = new Date(
        Date.now() + 15 * 60 * 1000
      );
    }

    await user.save();

    const err = new Error("Invalid email or password");
    err.statusCode = 401;
    throw err;
  }

  user.failedLoginAttempts = 0;
  user.lockUntil = null;

  await user.save();

  const accessToken = createAccessToken(user);

  const refreshToken = createRefreshToken();

  const tokenHash = hashToken(refreshToken);

  await RefreshToken.create({
    tokenHash,
    user: user._id,
    expiresAt: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    )
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      skills: user.skills
    }
  };
};


/*
  FORGOT PASSWORD
  Generates a 6-digit OTP.
*/

const forgotPassword = async (email) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({
    email: normalizedEmail
  });

  /*
    Don't reveal whether the email exists.
  */
  if (!user) {
    return {
      message:
        "If the email exists, a password reset OTP has been sent."
    };
  }

  const otp = crypto
    .randomInt(100000, 1000000)
    .toString();

  const otpHash = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  user.resetPasswordTokenHash = otpHash;

  user.resetPasswordExpiresAt = new Date(
    Date.now() + 10 * 60 * 1000
  );

  await user.save();

  /*
    TEMPORARY:
    Replace this console.log with your email service.
  */

  console.log(
    `Password reset OTP for ${user.email}: ${otp}`
  );

  return {
    message:
      "If the email exists, a password reset OTP has been sent."
  };
};


/*
  RESET PASSWORD
  Verifies OTP and updates password.
*/

const resetPassword = async (
  email,
  otp,
  newPassword
) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({
    email: normalizedEmail
  });

  if (!user) {
    const err = new Error("Invalid or expired OTP");
    err.statusCode = 400;
    throw err;
  }

  if (
    !user.resetPasswordTokenHash ||
    !user.resetPasswordExpiresAt
  ) {
    const err = new Error("Invalid or expired OTP");
    err.statusCode = 400;
    throw err;
  }

  if (user.resetPasswordExpiresAt < new Date()) {
    const err = new Error("OTP expired");
    err.statusCode = 400;
    throw err;
  }

  const otpHash = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  if (otpHash !== user.resetPasswordTokenHash) {
    const err = new Error("Invalid OTP");
    err.statusCode = 400;
    throw err;
  }

  user.password = await argon2.hash(newPassword);

  user.resetPasswordTokenHash = null;
  user.resetPasswordExpiresAt = null;

  await user.save();

  return {
    message: "Password reset successfully"
  };
};


/*
  CHANGE PASSWORD
  Used by an already logged-in user.
*/

const changePassword = async (
  userId,
  currentPassword,
  newPassword
) => {
  const user = await User.findById(userId);

  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  const validPassword = await argon2.verify(
    user.password,
    currentPassword
  );

  if (!validPassword) {
    const err = new Error("Current password is incorrect");
    err.statusCode = 400;
    throw err;
  }

  if (currentPassword === newPassword) {
    const err = new Error("New password must be different from current password");
    err.statusCode = 400;
    throw err;
  }

  user.password = await argon2.hash(newPassword);

  await user.save();

  return {
    message: "Password changed successfully"
  };
};


module.exports = {
  signup,
  login,
  forgotPassword,
  resetPassword,
  changePassword
};