const Note = require("../models/Note");

exports.createNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId, subsectionId, timestamp, content } = req.body;

    if (!courseId || !subsectionId || timestamp === undefined || !content) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    const note = await Note.create({ userId, courseId, subsectionId, timestamp, content });
    return res.status(200).json({ success: true, data: note });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


exports.getNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId, subsectionId } = req.body;

    const query = { userId, courseId };
    if (subsectionId) query.subsectionId = subsectionId;

    const notes = await Note.find(query).sort({ timestamp: 1 });
    return res.status(200).json({ success: true, data: notes });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


exports.updateNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const { noteId, content } = req.body;

    const note = await Note.findOneAndUpdate(
      { _id: noteId, userId },
      { content },
      { new: true }
    );
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });
    return res.status(200).json({ success: true, data: note });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


exports.deleteNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const { noteId } = req.body;

    const note = await Note.findOneAndDelete({ _id: noteId, userId });
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });
    return res.status(200).json({ success: true, message: "Note deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
