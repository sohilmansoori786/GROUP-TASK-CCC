const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const opportunityRoutes = require("./routes/opportunityRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Opportunity Hub Backend Running"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/users", userRoutes);

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");

        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error.message);
    });