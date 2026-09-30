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
  recommendations
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

router.post("/:id/apply", auth, apply);

module.exports = router;