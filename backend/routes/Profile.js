const express = require("express")
const router = express.Router()
const { auth, authLite, isInstructor } = require("../middlewares/auth")
const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  getEnrolledCourses,
  instructorDashboard,
} = require("../controllers/Profile")

// Profile routes
router.delete("/deleteProfile", authLite, deleteAccount)
router.put("/updateProfile", authLite, updateProfile)
router.get("/getUserDetails", authLite, getAllUserDetails)
router.put("/updateDisplayPicture", authLite, updateDisplayPicture)

// Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard)

module.exports = router
