const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    let token;

    // 1. Try to get token from cookies
    if (req.cookies && req.cookies.jwt_token) {
      token = req.cookies.jwt_token;
    } 
    // 2. Fallback to authorization header
    else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    console.error("JWT Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      errorDetails: error.message
    });
  }
};

module.exports = auth;