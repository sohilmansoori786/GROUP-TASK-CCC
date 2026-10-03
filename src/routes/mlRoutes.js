const express = require("express");

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

const {
  studentRecommend,
  predictRegistrations,
  eventDemand,
  organizerAnalytics,
  eventRisk
} = require("../controllers/mlController");

const router = express.Router();

router.post(
  "/student/recommend",
  auth,
  authorize("USER"),
  studentRecommend
);

router.post(
  "/organizer/predict-registrations",
  auth,
  authorize("ORGANIZER"),
  predictRegistrations
);

router.get(
  "/organizer/event-demand",
  auth,
  authorize("ORGANIZER"),
  eventDemand
);

router.get(
  "/organizer/analytics",
  auth,
  authorize("ORGANIZER"),
  organizerAnalytics
);

router.post(
  "/admin/event-risk",
  auth,
  authorize("ADMIN"),
  eventRisk
);

module.exports = router;