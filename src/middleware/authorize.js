const authorize = (...roles) => {
  return (req, res, next) => {
    const userRole = (req.user?.role || "").toUpperCase();
    const normalizedRoles = roles.map((r) => r.toUpperCase());

    if (!req.user || (!normalizedRoles.includes(userRole) && userRole !== "ADMIN")) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    next();
  };
};

module.exports = authorize;