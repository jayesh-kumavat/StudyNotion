const Course = require("../models/Course")
const User = require("../models/User")
const RatingAndReview = require("../models/RatingAndRaview")
const CourseProgress = require("../models/CourseProgress")

// personalized recommendations based on user's enrolled course tags
exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id

    const user = await User.findById(userId).populate({
      path: "courses",
      select: "tag category courseName",
    })

    const enrolledCourseIds = user.courses.map((c) => c._id.toString())

    // collect all tags from enrolled courses
    const userTags = []
    const userCategories = []
    user.courses.forEach((course) => {
      if (course.tag) userTags.push(...course.tag)
      if (course.category) userCategories.push(course.category.toString())
    })

    // frequency map for tags
    const tagFreq = {}
    userTags.forEach((tag) => {
      const t = tag.toLowerCase()
      tagFreq[t] = (tagFreq[t] || 0) + 1
    })

    console.log("user tags count:", Object.keys(tagFreq).length)

    let recommendations = []

    if (userTags.length > 0) {
      const tagPatterns = Object.keys(tagFreq).map((t) => new RegExp(t, "i"))

      // find matching courses user hasnt enrolled in
      recommendations = await Course.find({
        status: "Published",
        _id: { $nin: enrolledCourseIds },
        $or: [
          { tag: { $in: tagPatterns } },
          { category: { $in: userCategories } },
        ],
      })
        .populate("instructor", "firstName lastName image")
        .populate("ratingAndReviews")
        .populate("category", "name")
        .exec()

      // score each course
      recommendations = recommendations.map((course) => {
        let score = 0

        if (course.tag) {
          course.tag.forEach((tag) => {
            const t = tag.toLowerCase()
            if (tagFreq[t]) {
              score += tagFreq[t] * 2
            }
          })
        }

        // category match bonus
        if (course.category && userCategories.includes(course.category._id.toString())) {
          score += 3
        }

        // rating boost
        if (course.ratingAndReviews.length > 0) {
          const avgRating =
            course.ratingAndReviews.reduce((s, r) => s + r.rating, 0) /
            course.ratingAndReviews.length
          score += avgRating
        }

        // popularity
        score += Math.min(course.studentsEnrolled?.length || 0, 10) * 0.5

        return { course, score }
      })

      recommendations.sort((a, b) => b.score - a.score)
      recommendations = recommendations.slice(0, 10).map((r) => r.course)
    }

    if (recommendations.length < 5) {
      const existingIds = [...enrolledCourseIds, ...recommendations.map((r) => r._id.toString())]

      const popularCourses = await Course.find({
        status: "Published",
        _id: { $nin: existingIds },
      })
        .populate("instructor", "firstName lastName image")
        .populate("ratingAndReviews")
        .sort({ studentsEnrolled: -1 })
        .limit(10 - recommendations.length)
        .exec()

      recommendations = [...recommendations, ...popularCourses]
    }

    return res.status(200).json({
      success: true,
      data: recommendations,
    })
  } catch (error) {
    console.log("Recommendation error:", error)
    return res.status(500).json({
      success: false,
      message: "Could not fetch recommendations",
      error: error.message,
    })
  }
}


// all courses
exports.getTrendingCourses = async (req, res) => {
    try {
        const courses = await Course.find({ status: "Published" })
            .populate("instructor", "firstName lastName image")
            .populate("ratingAndReviews")
            .exec()

        // score
        const scored = courses.map((course) => {
            const enrollments = course.studentsEnrolled?.length || 0
            const avgRating = course.ratingAndReviews.length
                ? course.ratingAndReviews.reduce((s, r) => s + r.rating, 0) /
                  course.ratingAndReviews.length
                : 0
            const score = enrollments * 0.6 + avgRating * 2 + course.ratingAndReviews.length * 0.3
            return { course, score }
        })

        scored.sort((a, b) => b.score - a.score)
        const trending = scored.slice(0, 10).map((s) => s.course)

        return res.status(200).json({
            success: true,
            data: trending,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Error fetching trending courses",
        })
    }
}


// similar courses - same tags or category
exports.getSimilarCourses = async (req, res) => {
  try {
    const { courseId } = req.body

    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      })
    }

    const similar = await Course.find({
      status: "Published",
      _id: { $ne: courseId },
      $or: [
        { tag: { $in: course.tag.map((t) => new RegExp(t, "i")) } },
        { category: course.category },
      ],
    })
      .populate("instructor", "firstName lastName image")
      .populate("ratingAndReviews")
      .limit(6)
      .exec()

    return res.status(200).json({
      success: true,
      data: similar,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}
