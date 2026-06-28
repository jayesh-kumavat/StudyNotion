import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import {
  getPersonalizedRecommendations,
  getTrendingCourses
} from "../../../services/operations/recommendationAPI"

export default function RecommendedCourses() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendations = async () => {
      let result
      if (token) {

        // if user is logged in, get personalized recommendations
        result = await getPersonalizedRecommendations(token)
      }
      
      // fallback to trending if no personalized results
      if (!result || result.length === 0) {
        result = await getTrendingCourses()
      }
      setCourses(result)
      setLoading(false)
    }
    fetchRecommendations()
  }, [token])

  if (loading) {
    return (
      <div className="grid place-items-center py-10">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!courses.length) return null

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold text-richblack-5 mb-6">
        {token ? "Recommended For You" : "Trending Courses"}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.slice(0, 6).map((course) => (
          <div
            key={course._id}
            onClick={() => navigate(`/courses/${course._id}`)}
            className="cursor-pointer rounded-lg bg-richblack-800 overflow-hidden hover:scale-[1.02] transition-all duration-200"
          >
            <img
              src={course.thumbnail}
              alt={course.courseName}
              className="h-[140px] w-full object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-richblack-5 line-clamp-1">
                {course.courseName}
              </h3>
              <p className="text-sm text-richblack-300 mt-1">
                {course.instructor?.firstName} {course.instructor?.lastName}
              </p>
              <div className="flex items-center justify-between mt-3">
                <span className="font-semibold text-yellow-50">
                  {course.price === 0 ? "Free" : `₹${course.price}`}
                </span>
                <span className="text-xs text-richblack-300">
                  {course.studentsEnrolled?.length || 0} students
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
