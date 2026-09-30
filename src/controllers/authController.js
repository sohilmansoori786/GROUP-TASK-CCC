const authService = require("../services/authService");

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

module.exports = {
  signup,
  login
};