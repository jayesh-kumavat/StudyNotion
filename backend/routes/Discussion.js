const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/auth");

// Discussion Controllers Import
const {
  createDiscussion,
  getCourseDiscussions,
  addReply,
  toggleLikeDiscussion,
  deleteDiscussion,
} = require("../controllers/Discussion");

// Discussion Routes

router.post("/create", auth, createDiscussion);
router.post("/course", auth, getCourseDiscussions);
router.post("/reply", auth, addReply);
router.post("/like", auth, toggleLikeDiscussion);
router.post("/delete", auth, deleteDiscussion);

module.exports = router;
