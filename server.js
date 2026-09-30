require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const connectDB = require("./src/config/db");

const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const opportunityRoutes = require("./src/routes/opportunityRoutes");
const adminRoutes = require("./src/routes/adminRoutes");

const errorHandler = require("./src/middleware/errorHandler");

const app = express();

connectDB();

app.use(helmet());

app.use(
  cors({
    origin: true
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

app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});