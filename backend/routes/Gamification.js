const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/auth");

// Gamification Controllers Import
const {
  awardPoints,
  getUserGamification,
  getLeaderboard,
} = require("../controllers/Gamification");

router.post("/award-points", auth, awardPoints);
router.get("/profile", auth, getUserGamification);
router.get("/leaderboard", getLeaderboard);

module.exports = router;
