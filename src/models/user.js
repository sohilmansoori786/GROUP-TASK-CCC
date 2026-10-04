const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
   otpHash: {
         type: String,
         default: null
    },
   otpExpires: {
          type: Date,
          default: null
    },
   otpAttempts: {
           type: Number,
           default: 0
    },
    otpVerified: {
          type: Boolean,
          default: false
    },
    otpLastSentAt: {
          type: Date,
          default: null
    },
    
    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["USER", "ORGANIZER", "ADMIN"],
      default: "USER"
    },

    skills: {
      type: [String],
      default: []
    },

    savedOpportunities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Opportunity"
      }
    ],

    failedLoginAttempts: {
      type: Number,
      default: 0
    },

    lockUntil: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);