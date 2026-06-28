import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { RxCross2 } from "react-icons/rx"
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa"
import { useSelector } from "react-redux"
import { createRating } from "../../../services/operations/courseDetailsAPI"
import IconBtn from "../../common/IconBtn"


export default function CourseReviewModal({ setReviewModal }) {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { courseEntireData } = useSelector((state) => state.viewCourse)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    setValue("courseExperience", "")
    setValue("courseRating", 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ratingChanged = (newRating) => {
    // console.log(newRating)
    setValue("courseRating", newRating)
  }

  const onSubmit = async (data) => {
    await createRating(
      {
        courseId: courseEntireData._id,
        rating: data.courseRating,
        review: data.courseExperience,
      },
      token
    )
    setReviewModal(false)
  }

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">

        {/* Modal Header */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">Add Review</p>
          <button onClick={() => setReviewModal(false)}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <div className="flex items-center justify-center gap-x-4">
            <img
              src={user?.image}
              alt={user?.firstName + "profile"}
              className="aspect-square w-[50px] rounded-full object-cover"
            />
            <div className="">
              <p className="font-semibold text-richblack-5">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-richblack-5">Posting Publicly</p>
            </div>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 flex flex-col items-center"
          >
            <StarRating onChange={ratingChanged} />
            <div className="flex w-11/12 flex-col space-y-2 mt-4">
              <label
                className="text-sm text-richblack-5"
                htmlFor="courseExperience"
              >
                Add Your Experience <sup className="text-pink-200">*</sup>
              </label>
              <textarea
                id="courseExperience"
                placeholder="Add Your Experience"
                {...register("courseExperience", { required: true })}
                className="form-style resize-x-none min-h-[130px] w-full"
              />
              {errors.courseExperience && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                  Please Add Your Experience
                </span>
              )}
            </div>
            <div className="mt-6 flex w-11/12 justify-end gap-x-2">
              <button
                onClick={() => setReviewModal(false)}
                className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
              >
                Cancel
              </button>
              <IconBtn text="Save" />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}


function StarRating({ onChange }) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)

  const handleClick = (value) => {
    setRating(value)
    onChange(value)
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((star) => {
          const active = hover || rating
          return (
            <div key={star} className="relative cursor-pointer text-3xl">

              {/* Left half - for half star */}
              <div
                className="absolute inset-0 w-1/2 overflow-hidden z-10"
                onMouseEnter={() => setHover(star - 0.5)}
                onClick={() => handleClick(star - 0.5)}
              />

              {/* Right half - for full star */}
              <div
                className="absolute inset-0 left-1/2 w-1/2 z-10"
                onMouseEnter={() => setHover(star)}
                onClick={() => handleClick(star)}
              />
              
              {/* Star display */}
              {active >= star ? (
                <FaStar className="text-yellow-100" />
              ) : active >= star - 0.5 ? (
                <FaStarHalfAlt className="text-yellow-100" />
              ) : (
                <FaRegStar className="text-yellow-100" />
              )}
            </div>
          )
        })}
      </div>
      <p className="text-sm text-richblack-300">
        {(hover || rating) > 0 ? `${hover || rating} / 5` : "Select rating"}
      </p>
    </div>
  )
}
