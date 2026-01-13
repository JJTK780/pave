const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  getAllUsers,
  promoteToMentor,
} = require("../controllers/adminController");

// 🔐 Protect all admin routes
router.use(protect);
router.use(authorizeRoles("admin"));

router.get("/users", getAllUsers);
router.patch("/users/:id/promote", promoteToMentor);

module.exports = router;
