const express = require("express");
const router = express.Router();

const { auth, isAdmin } = require("../middlewares/auth");
const {
  getPlatformStats,
  getAllUsers,
  toggleUserStatus,
  toggleInstructorApproval,
  getAllCoursesAdmin,
  toggleCourseStatus,
  getAllTransactions,
  deleteUser,
} = require("../controllers/Admin");

// Admin Routes

// dashboard
router.get("/stats", auth, isAdmin, getPlatformStats);

// users
router.get("/users", auth, isAdmin, getAllUsers);
router.post("/toggle-user-status", auth, isAdmin, toggleUserStatus);
router.post("/toggle-instructor-approval", auth, isAdmin, toggleInstructorApproval);
router.post("/delete-user", auth, isAdmin, deleteUser);

// courses
router.get("/courses", auth, isAdmin, getAllCoursesAdmin);
router.post("/toggle-course-status", auth, isAdmin, toggleCourseStatus);

// transactions
router.get("/transactions", auth, isAdmin, getAllTransactions);

module.exports = router;
