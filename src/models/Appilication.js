const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    opportunity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opportunity",
      required: true
    },

    status: {
      type: String,
      enum: ["APPLIED", "SHORTLISTED", "REJECTED", "SELECTED"],
      default: "APPLIED"
    }
  },
  {
    timestamps: true
  }
);

applicationSchema.index(
  { user: 1, opportunity: 1 },
  { unique: true }
);

module.exports = mongoose.model("Application", applicationSchema);