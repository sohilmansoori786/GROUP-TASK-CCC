const argon2 = require("argon2");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");

const {
  createAccessToken,
  createRefreshToken,
  hashToken
} = require("../utils/tokens");

const signup = async ({ name, email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await User.findOne({
    email: normalizedEmail
  });

  if (existingUser) {
    throw new Error("Email already registered");
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
    throw new Error("Invalid email or password");
  }

  if (user.lockUntil && user.lockUntil > new Date()) {
    throw new Error("Account temporarily locked");
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

    throw new Error("Invalid email or password");
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

module.exports = {
  signup,
  login
};