const UserGamification = require("../models/UserGamification");

// points mapping
const POINTS_MAP = {
  course_enrolled: 10,
  lecture_completed: 5,
  course_completed: 50,
  review_given: 15,
  discussion_posted: 10,
};


// award points to user
exports.awardPoints = async (req, res) => {
  try {
    const userId = req.user.id;
    const { activityType, referenceId } = req.body;

    if (!POINTS_MAP[activityType]) {
      return res.status(400).json({
        success: false,
        message: "Invalid activity type",
      })
    }

    const points = POINTS_MAP[activityType];

    let gamification = await UserGamification.findOne({ userId });
    if (!gamification) {
      gamification = await UserGamification.create({
        userId,
        points: 0,
        activities: [],
      });
    }

    gamification.points += points;
    gamification.activities.push({
      type: activityType,
      points,
      referenceId,
    });

    await gamification.save();

    return res.status(200).json({
      success: true,
      data: {
        points: gamification.points,
      },
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Could not award points",
      error: error.message,
    })
  }
};


// get gamification profile for user
exports.getUserGamification = async (req, res) => {
  try {
    const userId = req.user.id
    let gamification = await UserGamification.findOne({ userId })

    if (!gamification) {
      gamification = await UserGamification.create({
        userId, points: 0, activities: []
      })
    }

    return res.status(200).json({
      success: true,
      data: gamification,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Failed to fetch gamification profile",
    })
  }
};


// leaderboard of top 20 users
exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await UserGamification.find({})
      .sort({ points: -1 })
      .limit(20)
      .populate({
        path: "userId",
        select: "firstName lastName image",
      })

    return res.status(200).json({
      success: true,
      data: leaderboard,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Error fetching leaderboard",
    })
  }
};
