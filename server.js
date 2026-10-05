require("dotenv").config();

const mlRoutes = require("./src/routes/mlRoutes");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const connectDB = require("./src/config/db");

const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const opportunityRoutes = require("./src/routes/opportunityRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const recommendationRoutes = require("./src/routes/recommendationRoutes");

const errorHandler = require("./src/middleware/errorHandler");

const app = express();

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

app.use(helmet());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
  })
);

app.use(
  express.json({
    limit: "100kb"
  })
);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Opportunity Hub Backend Running"
  });
});

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/users", userRoutes);

app.use(
  "/api/v1/opportunities",
  opportunityRoutes
);

app.use(
  "/api/v1/admin",
  adminRoutes
);

app.use(
  "/api/v1/recommendations",
  recommendationRoutes
);

app.use(
  "/api/v1/ml",
  mlRoutes
);

app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;