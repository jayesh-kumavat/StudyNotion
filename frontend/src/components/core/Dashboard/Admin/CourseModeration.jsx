import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { getAllCoursesAdmin, toggleCourseStatus } from "../../../../services/operations/adminAPI"


export default function CourseModeration() {
  const { token } = useSelector((state) => state.auth)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("")

  const fetchCourses = async () => {
    setLoading(true)
    const data = await getAllCoursesAdmin(token, filter)
    setCourses(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchCourses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  const handleToggle = async (courseId, currentStatus) => {
    const newStatus = currentStatus === "Published" ? "Draft" : "Published"
    await toggleCourseStatus(courseId, newStatus, token)
    fetchCourses()
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-medium text-richblack-5">
        Course Moderation
      </h1>

      {/* filter btns */}
      <div className="flex gap-2 mb-6">
        {["", "Published", "Draft"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === s
                ? "bg-yellow-50 text-richblack-900"
                : "bg-richblack-700 text-richblack-300 hover:bg-richblack-600"
            }`}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid min-h-[200px] place-items-center">
          <div className="spinner"></div>
        </div>
      ) : courses.length === 0 ? (
        <div className="rounded-lg bg-richblack-800 p-8 text-center text-richblack-300">
          No courses found
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {courses.map((course) => (
            <div
              key={course._id}
              className="rounded-lg bg-richblack-800 p-4 flex items-center gap-4"
            >
              <img
                src={course.thumbnail}
                alt=""
                className="h-16 w-24 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-richblack-5 truncate">
                  {course.courseName}
                </p>
                <p className="text-xs text-richblack-300 mt-0.5">
                  by {course.instructor?.firstName} {course.instructor?.lastName}{" "}
                  • {course.category?.name || "No Category"}
                </p>
                <p className="text-xs text-richblack-400 mt-0.5">
                  ₹{course.price} • {course.studentsEnrolled?.length || 0} students
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`px-2.5 py-1 rounded text-xs font-medium ${
                  course.status === "Published"
                    ? "bg-caribbeangreen-800 text-caribbeangreen-100"
                    : "bg-yellow-800 text-yellow-50"
                }`}>
                  {course.status}
                </span>
                <button
                  onClick={() => handleToggle(course._id, course.status)}
                  className={`px-3 py-1.5 rounded text-xs font-medium ${
                    course.status === "Published"
                      ? "bg-pink-700 text-pink-100 hover:bg-pink-600"
                      : "bg-caribbeangreen-700 text-caribbeangreen-100 hover:bg-caribbeangreen-600"
                  }`}
                >
                  {course.status === "Published" ? "Unpublish" : "Approve"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
