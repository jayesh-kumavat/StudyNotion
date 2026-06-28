import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { apiConnector } from "../../../services/apiconnector"
import { featuresEndpoints } from "../../../services/apis"
import { addToCart } from "../../../slices/cartSlice"
import GetAvgRating from "../../../utils/avgRating"
import RatingStars from "../../common/RatingStars"

export default function WishlistPage() {
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchWishlist() }, [])

  const fetchWishlist = async () => {
    try {
      const res = await apiConnector("GET", featuresEndpoints.GET_WISHLIST_API, null, {
        Authorization: `Bearer ${token}`,
      })
      if (res?.data?.success) setCourses(res.data.data)
    } catch (e) { console.log("FETCH WISHLIST ERROR", e) }
    setLoading(false)
  }

  const handleRemove = async (courseId) => {
    try {
      await apiConnector("POST", featuresEndpoints.TOGGLE_WISHLIST_API, { courseId }, {
        Authorization: `Bearer ${token}`,
      })
      setCourses(courses.filter((c) => c._id !== courseId))
      toast.success("Removed from wishlist")
    } catch (e) { toast.error("Failed to remove") }
  }

  const handleAddToCart = (course) => {
    dispatch(addToCart(course))
  }

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-medium text-richblack-5">My Wishlist</h1>
      <p className="border-b border-b-richblack-400 pb-2 font-semibold text-richblack-400">
        {courses.length} Courses in Wishlist
      </p>

      {courses.length === 0 ? (
        <p className="mt-14 text-center text-3xl text-richblack-100">Your wishlist is empty</p>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {courses.map((course) => {
            const avgRating = GetAvgRating(course.ratingAndReviews)
            return (
              <div key={course._id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-richblack-800 p-4">
                <div
                  className="flex flex-1 items-center gap-4 cursor-pointer"
                  onClick={() => navigate(`/courses/${course._id}`)}
                >
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="h-[80px] w-[120px] rounded-md object-cover"
                  />
                  <div>
                    <p className="text-lg font-semibold text-richblack-5">{course.courseName}</p>
                    <p className="text-sm text-richblack-300">
                      {course.instructor?.firstName} {course.instructor?.lastName}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-yellow-50">{avgRating}</span>
                      <RatingStars Review_Count={avgRating} Star_Size={16} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-xl font-semibold text-richblack-5">₹{course.price}</p>
                  <button
                    onClick={() => handleAddToCart(course)}
                    className="rounded bg-yellow-50 px-4 py-2 text-sm font-semibold text-richblack-900 hover:bg-yellow-100"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleRemove(course._id)}
                    className="rounded bg-richblack-700 px-4 py-2 text-sm font-semibold text-pink-200 hover:bg-richblack-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
