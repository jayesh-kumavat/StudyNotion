const mongoose = require("mongoose")
const Section = require("../models/Section")
const SubSection = require("../models/SubSection")
const CourseProgress = require("../models/CourseProgress")
const Course = require("../models/Course")
const UserGamification = require("../models/UserGamification")

const awardPointsHelper = async (userId, activityType, referenceId) => {
  const POINTS_MAP = {
    course_enrolled: 10,
    lecture_completed: 5,
    course_completed: 50,
    review_given: 15,
    discussion_posted: 10,
  }
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

exports.updateCourseProgress = async (req, res) => {
  const { courseId, subsectionId } = req.body
  const userId = req.user.id

  try {
    const subsection = await SubSection.findById(subsectionId)
    if (!subsection) {
      return res.status(404).json({ error: "Invalid subsection" })
    }


    let courseProgress = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })

    if (!courseProgress) {
      courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      })
    }

    {
      if (courseProgress.completedVideos.includes(subsectionId)) {
        return res.status(400).json({ error: "Subsection already completed" })
      }
      courseProgress.completedVideos.push(subsectionId)
    }

    await courseProgress.save()

    await awardPointsHelper(userId, "lecture_completed", subsectionId)

    // check if course is completed
    const course = await Course.findById(courseId).populate({
      path: "courseContent",
      populate: { path: "subSection" },
    })
    let totalLectures = 0
    course.courseContent.forEach((sec) => { totalLectures += sec.subSection.length })
    if (courseProgress.completedVideos.length >= totalLectures) {
      await awardPointsHelper(userId, "course_completed", courseId)
    }

    return res.status(200).json({ message: "Course progress updated" })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

exports.getProgressPercentage = async (req, res) => {
  const { courseId } = req.body
  const userId = req.user.id

  if (!courseId) {
    return res.status(400).json({ error: "Course ID not provided." })
  }

  try {
    let courseProgress = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })
      .populate({
        path: "courseID",
        populate: {
          path: "courseContent",
        },
      })
      .exec()

    if (!courseProgress) {
      return res.status(400).json({ error: "Can not find Course Progress with these IDs." })
    }

    let lectures = 0
    courseProgress.courseID.courseContent?.forEach((sec) => {
      lectures += sec.subSection.length || 0
    })

    let progressPercentage = (courseProgress.completedVideos.length / lectures) * 100
    const multiplier = Math.pow(10, 2)
    progressPercentage = Math.round(progressPercentage * multiplier) / multiplier

    return res.status(200).json({
      success: true,
      data: progressPercentage,
      message: "Successfully fetched Course progress",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

exports.saveVideoTimestamp = async (req, res) => {
  const { courseId, subsectionId, timestamp } = req.body
  const userId = req.user.id

  try {
    let courseProgress = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })

    if (!courseProgress) {
      courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
        videoProgress: {},
      })
    }

    courseProgress.videoProgress.set(subsectionId, timestamp)
    await courseProgress.save()

    return res.status(200).json({ success: true, message: "Timestamp saved" })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ success: false, error: "Internal server error" })
  }
}

exports.syncGamificationPoints = async (req, res) => {
  const userId = req.user.id
  try {
    let gamification = await UserGamification.findOne({ userId })
    if (!gamification) {
      gamification = await UserGamification.create({ userId, points: 0, badges: [], activities: [] })
    }

    if (gamification.points > 0) {
      await checkAndAwardBadges(gamification)
      await gamification.save()
      return res.status(200).json({ success: true, message: "Badges synced", data: gamification })
    }

    const allProgress = await CourseProgress.find({ userId }).populate({
      path: "courseID",
      populate: { path: "courseContent", populate: { path: "subSection" } },
    })

    let totalPoints = 0
    const activities = []

    for (const progress of allProgress) {
      if (!progress.courseID) continue
      // Points for enrollment
      totalPoints += 10
      activities.push({ type: "course_enrolled", points: 10, referenceId: progress.courseID._id })

      // Points for each completed lecture
      for (const videoId of progress.completedVideos) {
        totalPoints += 5
        activities.push({ type: "lecture_completed", points: 5, referenceId: videoId })
      }

      // Check if course is fully completed
      let totalLectures = 0
      progress.courseID.courseContent?.forEach((sec) => { totalLectures += sec.subSection?.length || 0 })
      if (totalLectures > 0 && progress.completedVideos.length >= totalLectures) {
        totalPoints += 50
        activities.push({ type: "course_completed", points: 50, referenceId: progress.courseID._id })
      }
    }

    gamification.points = totalPoints
    gamification.activities = activities
    await gamification.save()

    return res.status(200).json({ success: true, message: "Points synced", data: gamification })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ success: false, error: "Internal server error" })
  }
}

exports.getVideoTimestamp = async (req, res) => {
  const { courseId, subsectionId } = req.body
  const userId = req.user.id

  try {
    const courseProgress = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })

    if (!courseProgress || !courseProgress.videoProgress) {
      return res.status(200).json({ success: true, data: 0 })
    }

    const timestamp = courseProgress.videoProgress.get(subsectionId) || 0
    return res.status(200).json({ success: true, data: timestamp })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ success: false, error: "Internal server error" })
  }
}