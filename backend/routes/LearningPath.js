const express = require("express");
const router = express.Router();

const { auth, isStudent } = require("../middlewares/auth");

// Learning Path Controllers Import
const {
  generateLearningPath,
  getUserLearningPaths,
  updatePathProgress,
  deleteLearningPath,
} = require("../controllers/LearningPath");


// Learning Path Routes
router.post("/generate", auth, isStudent, generateLearningPath);
router.get("/my-paths", auth, isStudent, getUserLearningPaths);
router.post("/update-progress", auth, isStudent, updatePathProgress);
router.post("/delete", auth, isStudent, deleteLearningPath);

module.exports = router;
