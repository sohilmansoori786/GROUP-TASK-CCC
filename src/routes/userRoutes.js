const express = require("express");

const auth = require("../middleware/auth");

const {
  getProfile,
  updateSkills,
  saveOpportunity,
  getMyApplications
} = require("../controllers/userController");

const router = express.Router();

router.get("/profile", auth, getProfile);

router.patch("/skills", auth, updateSkills);

router.post(
  "/save/:opportunityId",
  auth,
  saveOpportunity
);

router.get(
  "/applications",
  auth,
  getMyApplications
);

module.exports = router;