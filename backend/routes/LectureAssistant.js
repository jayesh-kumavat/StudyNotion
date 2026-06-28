const express = require("express");
const router = express.Router();


const { auth } = require("../middlewares/auth");

// Lecture Assistant Controllers Import
const {
  askLectureAssistant,
  getTranscript,
} = require("../controllers/LectureAssistant");


// Ask AI about the lecture
router.post("/ask", auth, askLectureAssistant);

// Check if transcript exists
router.post("/transcript", auth, getTranscript);

module.exports = router;
