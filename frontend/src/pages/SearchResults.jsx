import RatingStars from "../components/common/RatingStars"
import { searchCourse } from "../services/operations/courseDetailsAPI"
import { useEffect, useState } from "react"
import Footer from "../components/common/Footer"
import GetAvgRating from "../utils/avgRating"
import { useSearchParams, useNavigate } from "react-router-dom"


export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get("q") || ""
  const [results, setResults] = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState(query)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (query) {
      setCurrentPage(1)
      setSearchInput(query)
      fetchResults(1)
    } else {
      setLoading(false)
    }

    // eslint-disable-next-line
  }, [query])

  const fetchResults = async (page) => {
    setLoading(true)
    const data = await searchCourse(query, page)
    setResults(data.courses)
    setPagination(data.pagination)
    setCurrentPage(page)
    setLoading(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`)
    }
  }

  const handlePageChange = (page) => {
    fetchResults(page)
    window.scrollTo(0, 0)
  }

  return (
    <>
      <div className="bg-richblack-800 py-8">
        <div className="mx-auto max-w-maxContent px-4">
          <form onSubmit={handleSearch} className="max-w-[600px] mx-auto mb-6">
            <div className="flex items-center rounded-full bg-richblack-700 border border-richblack-600 overflow-hidden">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search for courses..."
                className="flex-1 px-6 py-3 text-sm bg-transparent text-richblack-5 outline-none placeholder:text-richblack-300"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-yellow-50 text-richblack-900 font-semibold text-sm hover:bg-yellow-100 transition-colors"
              >
                Search
              </button>
            </div>
          </form>
          <h1 className="text-2xl font-semibold text-richblack-5">
            {query ? `Search results for "${query}"` : "Search Courses"}
          </h1>
          <p className="text-sm text-richblack-300 mt-1">
            {loading ? "Searching..." : `${pagination.total} course${pagination.total !== 1 ? "s" : ""} found`}
          </p>
        </div>
      </div>

      <div className="w-full mx-auto max-w-maxContent px-4 py-10">
        {loading ? (
          <div className="grid place-items-center py-20">
            <div className="spinner"></div>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-3xl text-richblack-100 mb-4">No courses found</p>
            <p className="text-richblack-300">Try different keywords or browse our catalog</p>
            <button
              onClick={() => navigate("/catalog")}
              className="mt-6 rounded-md bg-yellow-50 px-6 py-2 font-semibold text-richblack-900 hover:bg-yellow-100"
            >
              Browse Catalog
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {results.map((course) => {
                const avgRating = GetAvgRating(course.ratingAndReviews)
                return (
                  <div
                    key={course._id}
                    onClick={() => navigate(`/courses/${course._id}`)}
                    className="cursor-pointer rounded-xl bg-richblack-800 overflow-hidden border border-richblack-700 hover:border-richblack-500 transition-all hover:scale-[1.02] min-w-0"
                  >
                    <img
                      src={course.thumbnail}
                      alt={course.courseName}
                      className="h-[180px] w-full object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-richblack-5 text-lg line-clamp-1">
                        {course.courseName}
                      </h3>
                      <p className="text-sm text-richblack-300 mt-1">
                        {course.instructor?.firstName} {course.instructor?.lastName}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-yellow-50 text-sm font-semibold">{avgRating || 0}</span>
                        <RatingStars Review_Count={avgRating} Star_Size={16} />
                        <span className="text-richblack-400 text-xs">
                          ({course.ratingAndReviews?.length || 0})
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xl font-bold text-richblack-5">
                          {course.price === 0 ? "Free" : `₹${course.price}`}
                        </span>
                        <span className="text-xs text-richblack-300">
                          {course.studentsEnrolled?.length || 0} students
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>


            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-md bg-richblack-700 text-richblack-5 text-sm disabled:opacity-40 hover:bg-richblack-600 transition-colors"
                >
                  Previous
                </button>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-md text-sm font-semibold transition-colors ${
                      currentPage === page
                        ? "bg-yellow-50 text-richblack-900"
                        : "bg-richblack-700 text-richblack-5 hover:bg-richblack-600"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className="px-4 py-2 rounded-md bg-richblack-700 text-richblack-5 text-sm disabled:opacity-40 hover:bg-richblack-600 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </>
  )
}
