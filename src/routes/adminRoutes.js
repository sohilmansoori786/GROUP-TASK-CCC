const express = require("express");

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

const {
  getUsers
} = require("../controllers/adminController");

const router = express.Router();

router.get(
  "/users",
  auth,
  authorize("ADMIN"),
  getUsers
);

module.exports = router;