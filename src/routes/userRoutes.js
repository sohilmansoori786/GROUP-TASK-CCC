const express = require("express");

const auth = require("../middleware/auth");

const {
  getProfile,
  updateSkills,
  saveOpportunity
} = require("../controllers/userController");

const router = express.Router();

router.get("/profile", auth, getProfile);

router.patch("/skills", auth, updateSkills);

router.post(
  "/save/:opportunityId",
  auth,
  saveOpportunity
);

module.exports = router;