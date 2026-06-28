const User = require("../models/User")
const Course = require("../models/Course")
const Category = require("../models/Category")
const CourseProgress = require("../models/CourseProgress")
const RatingAndReview = require("../models/RatingAndRaview")
const Profile = require("../models/Profile")

exports.getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalStudents = await User.countDocuments({ accountType: "Student" })
    const totalInstructors = await User.countDocuments({ accountType: "Instructor" })
    const totalCourses = await Course.countDocuments()
    const publishedCourses = await Course.countDocuments({ status: "Published" })
    const draftCourses = await Course.countDocuments({ status: "Draft" })
    const totalCategories = await Category.countDocuments()
    const totalReviews = await RatingAndReview.countDocuments()

    // revenue calc
    const courses = await Course.find({ status: "Published" })
    let totalRevenue = 0
    let totalEnrollments = 0
    courses.forEach((course) => {
      const enrolled = course.studentsEnrolled?.length || 0
      totalEnrollments += enrolled
      totalRevenue += enrolled * course.price
    })

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const recentSignups = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    })

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalStudents,
        totalInstructors,
        totalCourses,
        publishedCourses,
        draftCourses,
        totalCategories,
        totalReviews,
        totalRevenue,
        totalEnrollments,
        recentSignups,
      },
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Failed to fetch platform stats",
      error: error.message,
    })
  }
}


// get all users details
exports.getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 20
        const search = req.query.search || ""
        const accountType = req.query.accountType || ""

        const query = {}
        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ]
        }
        if (accountType) {
            query.accountType = accountType
        }

        const total = await User.countDocuments(query)
        const users = await User.find(query)
            .select("-password")
            .populate("additionalDetails")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)

        return res.status(200).json({
            success: true,
            data: {
                users,
                total,
                page,
                totalPages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Could not fetch users",
        })
    }
}


// ban/unban any user
exports.toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.body
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    user.active = !user.active
    await user.save()
    console.log(`User ${userId} active: ${user.active}`)

    return res.status(200).json({
      success: true,
      message: `User ${user.active ? "activated" : "banned"} successfully`,
      data: { active: user.active },
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    })
  }
}


// approve/reject any instructor
exports.toggleInstructorApproval = async (req, res) => {
    try {
        const { userId } = req.body
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }

        if (user.accountType !== "Instructor") {
            return res.status(400).json({
                success: false,
                message: "User is not an instructor",
            })
        }

        user.approved = !user.approved
        await user.save()

        return res.status(200).json({
            success: true,
            message: `Instructor ${user.approved ? "approved" : "rejected"}`,
            data: { approved: user.approved },
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}



exports.getAllCoursesAdmin = async (req, res) => {
  try {
    const status = req.query.status || ""
    const query = {}
    if (status) query.status = status

    const courses = await Course.find(query)
      .populate("instructor", "firstName lastName email")
      .populate("category", "name")
      .sort({ createdAt: -1 })

    return res.status(200).json({
      success: true,
      data: courses,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      error: error.message,
    })
  }
}



// publish/unpublish any course
exports.toggleCourseStatus = async (req, res) => {
    try {
        const { courseId, status } = req.body

        if (!["Published", "Draft"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value",
            })
        }

        const course = await Course.findByIdAndUpdate(
            courseId,
            { status },
            { new: true }
        )

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            })
        }

        return res.status(200).json({
            success: true,
            message: `Course ${status === "Published" ? "approved" : "unpublished"}`,
            data: course,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Could not update course status",
        })
    }
}

// transactions details
exports.getAllTransactions = async (req, res) => {
  try {
    const courses = await Course.find({
      "studentsEnrolled.0": { $exists: true },
    })
      .populate("instructor", "firstName lastName")
      .populate("studentsEnrolled", "firstName lastName email")
      .select("courseName price studentsEnrolled createdAt")
      .sort({ createdAt: -1 })


    const transactions = []
    courses.forEach((course) => {
      course.studentsEnrolled.forEach((student) => {
        transactions.push({
          courseId: course._id,
          courseName: course.courseName,
          instructor: course.instructor,
          student,
          amount: course.price,
        })
      })
    })

    const total = transactions.length
    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0)

    return res.status(200).json({
      success: true,
      data: {
        transactions: transactions.slice(0, 50), // limit to 50 for now
        total,
        totalRevenue,
      },
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Error fetching transactions",
    })
  }
}



// delete any user permanently
exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.body
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }

        // profile delete
        if (user.additionalDetails) {
            await Profile.findByIdAndDelete(user.additionalDetails)
        }

        // remove from enrolled courses
        for (const courseId of user.courses) {
            await Course.findByIdAndUpdate(courseId, {
                $pull: { studentsEnrolled: userId },
            })
        }

        await CourseProgress.deleteMany({ userId })
        await User.findByIdAndDelete(userId)
        console.log("admin deleted user:", userId)

        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "User Cannot be deleted",
            error: error.message,
        })
    }
}
