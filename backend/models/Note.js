const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  subsectionId: { type: mongoose.Schema.Types.ObjectId, ref: "SubSection", required: true },
  timestamp: { type: Number, required: true },
  content: { type: String, required: true },
}, { timestamps: true });

noteSchema.index({ userId: 1, courseId: 1, subsectionId: 1 });

module.exports = mongoose.model("Note", noteSchema);
