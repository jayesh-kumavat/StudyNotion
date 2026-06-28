import React, { useEffect, useState } from "react"
import ReactStars from "react-rating-stars-component"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import "../../App.css"
import { FaStar } from "react-icons/fa"
import { Autoplay, FreeMode, Pagination } from "swiper"
import { apiConnector } from "../../services/apiconnector"
import { ratingsEndpoints } from "../../services/apis"
import { Skeleton } from "../ui"

function ReviewSlider() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const truncateWords = 15

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await apiConnector("GET", ratingsEndpoints.REVIEWS_DETAILS_API)
        if (data?.success) setReviews(data?.data || [])
      } catch (err) {
        console.error("Error fetching reviews:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [])

  if (loading) {
    return (
      <div className="my-[50px] grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="glass-card p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton variant="circle" className="h-9 w-9" />
              <div className="space-y-1 flex-1">
                <Skeleton variant="text" className="w-24" />
                <Skeleton variant="text" className="w-16 h-3" />
              </div>
            </div>
            <Skeleton variant="text" className="w-full" />
            <Skeleton variant="text" className="w-3/4" />
          </div>
        ))}
      </div>
    )
  }

  if (!reviews.length) {
    return (
      <div className="my-[50px] w-full text-center">
        <p className="text-richblack-300 text-lg">No reviews so far</p>
      </div>
    )
  }

  return (
    <div className="my-[50px] w-full">
      <Swiper
        slidesPerView={1}
        spaceBetween={20}
        loop={reviews.length > 4}
        freeMode={true}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        modules={[FreeMode, Pagination, Autoplay]}
        className="w-full"
      >
        {reviews.map((review, i) => (
          <SwiperSlide key={i}>
            <div className="glass-card p-4 text-[14px] space-y-3 h-[180px]">
              <div className="flex items-center gap-3">
                <img
                  src={review?.user?.image || `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`}
                  alt=""
                  className="h-9 w-9 rounded-full object-cover border-2 border-indigo-500/20"
                />
                <div>
                  <h1 className="font-semibold text-slate-900 dark:text-white text-sm">
                    {`${review?.user?.firstName} ${review?.user?.lastName}`}
                  </h1>
                  <h2 className="text-[11px] text-slate-500 dark:text-slate-400">
                    {review?.course?.courseName}
                  </h2>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                {review?.review?.split(" ").length > truncateWords
                  ? `${review?.review.split(" ").slice(0, truncateWords).join(" ")} ...`
                  : review?.review}
              </p>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-amber-500 text-sm">{review.rating.toFixed(1)}</span>
                <ReactStars
                  count={5}
                  value={review.rating}
                  size={16}
                  edit={false}
                  activeColor="#f59e0b"
                  emptyIcon={<FaStar />}
                  fullIcon={<FaStar />}
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default ReviewSlider
