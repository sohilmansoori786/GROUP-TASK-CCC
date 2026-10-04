const express = require("express");

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

const validate = require("../middleware/validate");

const {
  opportunitySchema
} = require("../validators/opportunityValidator");

const {
  createOpportunity,
  getOpportunities,
  getOpportunity,
  apply,
  recommendations,
  getApplicants,
  updateOpportunity,
  deleteOpportunity
} = require("../controllers/opportunityController");

const router = express.Router();

router.get("/", getOpportunities);

router.get(
  "/recommendations",
  auth,
  recommendations
);

router.get("/:id", getOpportunity);

router.post(
  "/",
  auth,
  authorize("ORGANIZER", "ADMIN"),
  validate(opportunitySchema),
  createOpportunity
);

router.get(
  "/:id/applicants",
  auth,
  authorize("ORGANIZER", "ADMIN"),
  getApplicants
);

router.put(
  "/:id",
  auth,
  authorize("ORGANIZER", "ADMIN"),
  validate(opportunitySchema),
  updateOpportunity
);

router.delete(
  "/:id",
  auth,
  authorize("ORGANIZER", "ADMIN"),
  deleteOpportunity
);

router.post("/:id/apply", auth, authorize("USER"), apply);

module.exports = router;