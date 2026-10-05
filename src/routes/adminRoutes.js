const express = require("express");

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

const {
  getUsers,
  getPendingEvents,
  updateEventStatus,
  getPlatformAnalytics
} = require("../controllers/adminController");

const router = express.Router();

router.get(
  "/users",
  auth,
  authorize("ADMIN", "ORGANIZER"),
  getUsers
);

router.get(
  "/events/pending",
  auth,
  authorize("ADMIN", "ORGANIZER"),
  getPendingEvents
);

router.patch(
  "/events/:id/status",
  auth,
  authorize("ADMIN", "ORGANIZER"),
  updateEventStatus
);

router.get(
  "/analytics",
  auth,
  authorize("ADMIN", "ORGANIZER"),
  getPlatformAnalytics
);

module.exports = router;