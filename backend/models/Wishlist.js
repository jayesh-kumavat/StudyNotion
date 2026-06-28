const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true
    },
    courses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course"
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wishlist", wishlistSchema);
