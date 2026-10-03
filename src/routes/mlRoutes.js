const express = require("express");

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

const {
  studentRecommend,
  predictRegistrations,
  eventDemand,
  organizerAnalytics,
  eventRisk,
   getDomains,
  categorizeDomain,
  analyzeSentiment,
  analyzeSentimentBatch
} = require("../controllers/mlController");

const router = express.Router();

router.post(                    //9 ML Routes
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

router.get(
  "/domains",
  auth,
  getDomains
);

router.post(
  "/categorize",
  auth,
  categorizeDomain
);

router.post(
  "/sentiment",
  auth,
  analyzeSentiment
);

router.post(
  "/sentiment/batch",
  auth,
  analyzeSentimentBatch
);

module.exports = router;