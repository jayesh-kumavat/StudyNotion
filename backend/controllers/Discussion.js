const Discussion = require("../models/Discussion");
const UserGamification = require("../models/UserGamification");

const awardPointsHelper = async (userId, activityType, referenceId) => {
  const POINTS_MAP = { course_enrolled: 10, lecture_completed: 5, course_completed: 50, review_given: 15, discussion_posted: 10 }
  const points = POINTS_MAP[activityType]
  if (!points) return
  let gamification = await UserGamification.findOne({ userId })
  if (!gamification) {
    gamification = await UserGamification.create({ userId, points: 0, activities: [] })
  }
  gamification.points += points
  gamification.activities.push({ type: activityType, points, referenceId })
  await gamification.save()
}

//create discussion post
exports.createDiscussion = async (req, res) => {
    try {
        const userId = req.user.id
        const { courseId, sectionId, title, message, tags } = req.body

        if (!courseId || !title || !message) {
            return res.status(400).json({
                success: false,
                message: "Course, title, and message are required",
            })
        }

        const discussion = await Discussion.create({
            courseId,
            sectionId,
            user: userId,
            title,
            message,
            tags: tags || [],
        })

        const populated = await Discussion.findById(discussion._id)
            .populate("user", "firstName lastName image")

        console.log("new discussion:", discussion._id)

        // Award points for posting discussion
        await awardPointsHelper(userId, "discussion_posted", discussion._id)

        return res.status(200).json({
            success: true,
            data: populated,
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Failed to create discussion",
            error: error.message,
        })
    }
}


//get discussions for a course
exports.getCourseDiscussions = async (req, res) => {
  try {
    const { courseId } = req.body

    const discussions = await Discussion.find({ courseId })
      .populate("user", "firstName lastName image")
      .populate("replies.user", "firstName lastName image")
      .sort({ isPinned: -1, createdAt: -1 })

    return res.status(200).json({
      success: true,
      data: discussions,
    })
  } catch (error) {
    console.log("Error fetching discussions:", error)
    return res.status(500).json({
      success: false,
      message: "Could not fetch discussions",
    })
  }
}


//reply to a discussion
exports.addReply = async (req, res) => {
    try {
        const userId = req.user.id
        const { discussionId, message } = req.body

        if (!discussionId || !message) {
            return res.status(400).json({
                success: false,
                message: "Discussion ID and message are required",
            })
        }

        const discussion = await Discussion.findByIdAndUpdate(
            discussionId,
            {
                $push: {
                    replies: { user: userId, message },
                },
            },
            { new: true }
        )
            .populate("user", "firstName lastName image")
            .populate("replies.user", "firstName lastName image")

        if(!discussion) {
            return res.status(404).json({
                success: false,
                message: "Discussion not found",
            })
        }

        return res.status(200).json({
            success: true,
            data: discussion,
        })
    }
    catch(error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Could not add reply",
            error: error.message,
        })
    }
}


// like/unlike toggle
exports.toggleLikeDiscussion = async (req, res) => {
  try {
    const userId = req.user.id
    const { discussionId } = req.body

    const discussion = await Discussion.findById(discussionId)
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found",
      })
    }

    const likeIndex = discussion.likes.indexOf(userId)
    if (likeIndex === -1) {
      discussion.likes.push(userId)
    } else {
      discussion.likes.splice(likeIndex, 1)
    }
    await discussion.save()

    return res.status(200).json({
      success: true,
      data: {
        likes: discussion.likes.length,
        isLiked: likeIndex === -1,
      },
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    })
  }
}


// delete discussion (only author)
exports.deleteDiscussion = async (req, res) => {
    try {
        const userId = req.user.id
        const { discussionId } = req.body

        const discussion = await Discussion.findOne({
            _id: discussionId,
            user: userId,
        })

        if (!discussion) {
            return res.status(404).json({
                success: false,
                message: "Discussion not found or you are not authorized",
            })
        }

        await Discussion.findByIdAndDelete(discussionId)
        // console.log("deleted discussion:", discussionId)

        return res.status(200).json({
            success: true,
            message: "Discussion deleted successfully",
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        })
    }
}
