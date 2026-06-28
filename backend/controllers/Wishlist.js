const Wishlist = require("../models/Wishlist");


exports.toggleWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.body;

    if (!courseId) return res.status(400).json({ success: false, message: "Course ID required" });

    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId, courses: [] });
    }

    const index = wishlist.courses.indexOf(courseId);
    if (index === -1) {
      wishlist.courses.push(courseId);
      await wishlist.save();
      return res.status(200).json({ success: true, message: "Added to wishlist", added: true });
    } else {
      wishlist.courses.splice(index, 1);
      await wishlist.save();
      return res.status(200).json({ success: true, message: "Removed from wishlist", added: false });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const wishlist = await Wishlist.findOne({ userId }).populate({
      path: "courses",
      populate: [
        { path: "instructor", select: "firstName lastName" },
        { path: "ratingAndReviews" },
      ],
    });

    return res.status(200).json({
      success: true,
      data: wishlist?.courses || [],
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
