const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasksByModule,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Get tasks for a module (intern + mentor)
router.get("/module/:moduleId", protect, getTasksByModule);

// Mentor-only actions
router.post("/", protect, authorizeRoles("mentor"), createTask);

router.put("/:id", protect, authorizeRoles("mentor"), updateTask);

router.delete("/:id", protect, authorizeRoles("mentor"), deleteTask);

module.exports = router;
