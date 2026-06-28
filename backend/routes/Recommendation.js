const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/auth");

const {
  getRecommendations,
  getTrendingCourses,
  getSimilarCourses,
} = require("../controllers/Recommendation");

// Recommendation Routes

router.get("/personalized", auth, getRecommendations);
router.get("/trending", getTrendingCourses);
router.post("/similar", getSimilarCourses);

module.exports = router;
