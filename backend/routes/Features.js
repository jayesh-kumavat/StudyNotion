const express = require("express");
const router = express.Router();
const { auth, isStudent, isInstructor } = require("../middlewares/auth");
const { createNote, getNotes, updateNote, deleteNote } = require("../controllers/Note");
const { toggleWishlist, getWishlist } = require("../controllers/Wishlist");
const { addResource, deleteResource } = require("../controllers/Resource");

// Notes (students only)
router.post("/notes/create", auth, isStudent, createNote);
router.post("/notes/get", auth, isStudent, getNotes);
router.post("/notes/update", auth, isStudent, updateNote);
router.post("/notes/delete", auth, isStudent, deleteNote);

// Wishlist (students only)
router.post("/wishlist/toggle", auth, isStudent, toggleWishlist);
router.get("/wishlist", auth, isStudent, getWishlist);

// Resources (instructors only)
router.post("/resource/add", auth, isInstructor, addResource);
router.post("/resource/delete", auth, isInstructor, deleteResource);

module.exports = router;
