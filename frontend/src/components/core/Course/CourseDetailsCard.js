import React from "react"
import copy from "copy-to-clipboard"
import { toast } from "react-hot-toast"
import { BsFillCaretRightFill } from "react-icons/bs"
import { FaShareSquare, FaHeart, FaRegHeart } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { addToCart } from "../../../slices/cartSlice"
import { ACCOUNT_TYPE } from "../../../utils/constants"
import { apiConnector } from "../../../services/apiconnector"
import { featuresEndpoints } from "../../../services/apis"


function CourseDetailsCard({ course, setConfirmationModal, handleBuyCourse }) {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [wishlisted, setWishlisted] = useState(false)

  const {
    thumbnail: ThumbnailImage,
    price: CurrentPrice,
    _id: courseId,
  } = course

  // Check if course is already in wishlist on load
  React.useEffect(() => {
    if (!token || user?.accountType !== ACCOUNT_TYPE.STUDENT) return
    const checkWishlist = async () => {
      try {
        const res = await apiConnector("GET", featuresEndpoints.GET_WISHLIST_API, null, {
          Authorization: `Bearer ${token}`,
        })
        if (res?.data?.success) {
          const isInWishlist = res.data.data.some((c) => c._id === courseId)
          setWishlisted(isInWishlist)
        }
      } catch (e) {}
    }
    checkWishlist()
  }, [token, courseId])

  const handleShare = () => {
    copy(window.location.href)
    toast.success("Link copied to clipboard")
  }

  const handleWishlist = async () => {
    if (!token) {
      toast.error("Please login to add to wishlist")
      return
    }
    try {
      const res = await apiConnector("POST", featuresEndpoints.TOGGLE_WISHLIST_API, { courseId }, {
        Authorization: `Bearer ${token}`,
      })
      if (res?.data?.success) {
        setWishlisted(res.data.added)
        toast.success(res.data.message)
      }
    } catch (e) { toast.error("Failed to update wishlist") }
  }

  const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an Instructor. You can't buy a course.")
      return
    }
    if (token) {
      dispatch(addToCart(course))
      return
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to add To Cart",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  // console.log("Student already enrolled ", course?.studentsEnroled, user?._id)

  return (
    <>
      <div
        className={`flex flex-col gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5`}
      >
        {/* Course Image */}
        <img
          src={ThumbnailImage}
          alt={course?.courseName}
          className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full"
        />

        <div className="px-4">
          <div className="space-x-3 pb-4 text-3xl font-semibold">
            Rs. {CurrentPrice}
          </div>
          <div className="flex flex-col gap-4">
            <button
              className="yellowButton"
              onClick={
                user && course?.studentsEnrolled.includes(user?._id)
                  ? () => navigate("/dashboard/enrolled-courses")
                  : handleBuyCourse
              }
            >
              {user && course?.studentsEnrolled.includes(user?._id)
                ? "Go To Course"
                : "Buy Now"}
            </button>
            {(!user || !course?.studentsEnrolled.includes(user?._id)) && (
              <button onClick={handleAddToCart} className="blackButton">
                Add to Cart
              </button>
            )}
          </div>
          <div>
            <p className="pb-3 pt-6 text-center text-sm text-richblack-25">
              30-Day Money-Back Guarantee
            </p>
          </div>

          <div className={``}>
            <p className={`my-2 text-xl font-semibold `}>
              This Course Includes :
            </p>
            <div className="flex flex-col gap-3 text-sm text-caribbeangreen-100">
              {course?.instructions?.map((item, i) => {
                return (
                  <p className={`flex items-center gap-2`} key={i}>
                    <BsFillCaretRightFill className="flex-shrink-0" />
                    <span>{item}</span>
                  </p>
                )
              })}
            </div>
          </div>
          <div className="text-center">
            <div className="flex justify-center gap-4 py-6">
              <button
                className="flex items-center gap-2 text-yellow-100"
                onClick={handleShare}
              >
                <FaShareSquare size={15} /> Share
              </button>
              {user?.accountType === ACCOUNT_TYPE.STUDENT && (
                <button
                  className="flex items-center gap-2 text-pink-200"
                  onClick={handleWishlist}
                >
                  {wishlisted ? <FaHeart size={15} /> : <FaRegHeart size={15} />}
                  {wishlisted ? "Wishlisted" : "Wishlist"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CourseDetailsCard