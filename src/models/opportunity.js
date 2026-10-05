const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending"
    },

    description: {
      type: String,
      required: true,
      maxlength: 5000
    },

    organization: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    skillsRequired: {
      type: [String],
      default: []
    },

    location: {
      type: String,
      default: "Online"
    },

    deadline: {
      type: Date,
      required: true
    },

    applicationLink: {
      type: String,
      required: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Opportunity", opportunitySchema);