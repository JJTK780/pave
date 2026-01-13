const express = require("express");
const router = express.Router();

const {
  createRoadmap,
  getAllRoadmaps,
  getRoadmapById,
  updateRoadmap,
  deleteRoadmap,
} = require("../controllers/roadmapController");

const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Public (logged-in users)
router.get("/", protect, getAllRoadmaps);
router.get("/:id", protect, getRoadmapById);

// Mentor-only
router.post("/", protect, authorizeRoles("mentor"), createRoadmap);
router.put("/:id", protect, authorizeRoles("mentor"), updateRoadmap);
router.delete("/:id", protect, authorizeRoles("mentor"), deleteRoadmap);

module.exports = router;
