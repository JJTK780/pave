const express = require("express");
const router = express.Router();

const {
  markTaskCompleted,
  getMyProgress,
  createProgress,
  startRoadmap,
} = require("../controllers/progressController");

const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.post("/start", protect, authorizeRoles("intern"), startRoadmap);

// Start roadmap / init task progress
router.post("/", protect, authorizeRoles("intern"), createProgress);

// Intern marks task as completed
router.post("/complete", protect, authorizeRoles("intern"), markTaskCompleted);

// Intern views own progress
router.get("/me", protect, authorizeRoles("intern"), getMyProgress);

module.exports = router;
