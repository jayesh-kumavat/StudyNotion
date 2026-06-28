const LearningPath = require("../models/LearningPath")
const Course = require("../models/Course")
const User = require("../models/User")
const CourseProgress = require("../models/CourseProgress")


// generate a learning path based on user interest
exports.generateLearningPath = async (req, res) => {
  try {
    const userId = req.user.id
    const { interests, skillLevel, title } = req.body

    if (!interests || !interests.length) {
      return res.status(400).json({
        success: false,
        message: "Interests are required",
      })
    }

    const matchingCourses = await Course.find({
      status: "Published",
      $or: [
        { tag: { $in: interests.map((i) => new RegExp(i, "i")) } },
        { courseName: { $regex: interests.join("|"), $options: "i" } },
      ],
    })
      .populate("instructor", "firstName lastName")
      .populate("ratingAndReviews")
      .exec()

    console.log("matching courses for path:", matchingCourses.length)

    const user = await User.findById(userId)
    const enrolledCourseIds = user.courses.map((c) => c.toString())

    const availableCourses = matchingCourses
      .filter((c) => !enrolledCourseIds.includes(c._id.toString()))
      .sort((a, b) => {
        // sort by avg rating
        const avgA = a.ratingAndReviews.length
          ? a.ratingAndReviews.reduce((s, r) => s + r.rating, 0) / a.ratingAndReviews.length
          : 0
        const avgB = b.ratingAndReviews.length
          ? b.ratingAndReviews.reduce((s, r) => s + r.rating, 0) / b.ratingAndReviews.length
          : 0
        return avgB - avgA
      })
      .slice(0, 10)

    let orderedCourses = availableCourses
    if (skillLevel === "beginner") {
      orderedCourses = availableCourses.sort((a, b) => a.price - b.price)
    } else if (skillLevel === "advanced") {
      orderedCourses = availableCourses.sort((a, b) => b.price - a.price)
    }

    const learningPath = await LearningPath.create({
      userId,
      title: title || `${interests[0]} Learning Path`,
      description: `Personalized path for ${skillLevel || "beginner"} level covering: ${interests.join(", ")}`,
      interests,
      skillLevel: skillLevel || "beginner",
      courses: orderedCourses.map((course, index) => ({
        courseId: course._id,
        order: index + 1,
        status: "pending",
      })),
    })

    const populated = await LearningPath.findById(learningPath._id)
      .populate({
        path: "courses.courseId",
        select: "courseName thumbnail price instructor",
        populate: {
          path: "instructor",
          select: "firstName lastName",
        },
      })

    console.log("path created:", learningPath._id)

    return res.status(200).json({
      success: true,
      data: populated,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Failed to generate learning path",
      error: error.message,
    })
  }
}


// get all paths for current user
exports.getUserLearningPaths = async (req, res) => {
    try {
        const userId = req.user.id

        const paths = await LearningPath.find({ userId, isActive: true })
            .populate({
                path: "courses.courseId",
                select: "courseName thumbnail price",
            })
            .sort({ createdAt: -1 })

        return res.status(200).json({
            success: true,
            data: paths,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Could not fetch learning paths",
        })
    }
}


// update course status inside a path
exports.updatePathProgress = async (req, res) => {
  try {
    const userId = req.user.id
    const { pathId, courseId, status } = req.body

    const path = await LearningPath.findOne({ _id: pathId, userId })
    if (!path) {
      return res.status(404).json({
        success: false,
        message: "Learning path not found",
      })
    }

    const courseEntry = path.courses.find(
      (c) => c.courseId.toString() === courseId
    )
    if (courseEntry) {
      courseEntry.status = status
    }


    // recalculate progress percentage
    const completed = path.courses.filter((c) => c.status === "completed").length
    path.progress = Math.round((completed / path.courses.length) * 100)

    await path.save()

    return res.status(200).json({
      success: true,
      data: path,
    })
  } catch (error) {
    console.log("Error updating path progress:", error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}


// delete learning path (soft delete)
exports.deleteLearningPath = async (req, res) => {
    try {
        const userId = req.user.id
        const { pathId } = req.body

        await LearningPath.findOneAndUpdate(
            { _id: pathId, userId },
            { isActive: false }
        )

        return res.status(200).json({
            success: true,
            message: "Learning path removed",
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Could not delete learning path",
        })
    }
}
