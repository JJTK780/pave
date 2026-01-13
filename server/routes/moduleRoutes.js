const express = require("express");
const router = express.Router();

const {
  createModule,
  getModulesByRoadmap,
  updateModule,
  deleteModule,
} = require("../controllers/moduleController");

const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Get weeks for a roadmap (Intern + Mentor)
router.get("/roadmap/:roadmapId", protect, getModulesByRoadmap);

// Mentor-only actions
router.post("/", protect, authorizeRoles("mentor"), createModule);

router.put("/:id", protect, authorizeRoles("mentor"), updateModule);

router.delete("/:id", protect, authorizeRoles("mentor"), deleteModule);

module.exports = router;
