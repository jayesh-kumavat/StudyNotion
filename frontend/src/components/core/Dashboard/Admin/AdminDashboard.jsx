import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { getPlatformStats } from "../../../../services/operations/adminAPI"


export default function AdminDashboard() {
  const { token } = useSelector((state) => state.auth)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getPlatformStats(token)
      if (data) setStats(data)
      setLoading(false)
    }
    fetchStats()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-medium text-richblack-5">
        Admin Dashboard
      </h1>
      <p className="text-richblack-300 mb-6">Platform overview and management</p>

      {/* stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Users" value={stats?.totalUsers || 0} />
        <StatCard label="Students" value={stats?.totalStudents || 0} />
        <StatCard label="Instructors" value={stats?.totalInstructors || 0} />
        <StatCard
          label="Total Revenue"
          value={`₹${stats?.totalRevenue?.toLocaleString() || 0}`}
        />
        <StatCard label="Total Courses" value={stats?.totalCourses || 0} />
        <StatCard label="Enrollments" value={stats?.totalEnrollments || 0} />
        <StatCard label="Reviews" value={stats?.totalReviews || 0} />
        <StatCard label="New (30 days)" value={stats?.recentSignups || 0} />
      </div>

      {/* course status and other metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg bg-richblack-800 p-6">
          <h2 className="text-lg font-semibold text-richblack-5 mb-4">
            Course Status
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-richblack-300">Published</span>
              <span className="px-3 py-1 rounded-full bg-caribbeangreen-800 text-caribbeangreen-100 text-sm font-medium">
                {stats?.publishedCourses || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-richblack-300">Draft</span>
              <span className="px-3 py-1 rounded-full bg-yellow-800 text-yellow-50 text-sm font-medium">
                {stats?.draftCourses || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-richblack-300">Categories</span>
              <span className="px-3 py-1 rounded-full bg-blue-800 text-blue-100 text-sm font-medium">
                {stats?.totalCategories || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-richblack-800 p-6">
          <h2 className="text-lg font-semibold text-richblack-5 mb-4">
            Platform Health
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-richblack-300">Instructor Ratio</span>
                <span className="text-richblack-5 font-medium">
                  {stats?.totalUsers
                    ? Math.round(
                        (stats.totalInstructors / stats.totalUsers) * 100
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="h-2 rounded-full bg-richblack-700">
                <div
                  className="h-2 rounded-full bg-blue-400"
                  style={{
                    width: `${
                      stats?.totalUsers
                        ? (stats.totalInstructors / stats.totalUsers) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-richblack-300">Course Publish Rate</span>
                <span className="text-richblack-5 font-medium">
                  {stats?.totalCourses
                    ? Math.round(
                        (stats.publishedCourses / stats.totalCourses) * 100
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="h-2 rounded-full bg-richblack-700">
                <div
                  className="h-2 rounded-full bg-caribbeangreen-200"
                  style={{
                    width: `${
                      stats?.totalCourses
                        ? (stats.publishedCourses / stats.totalCourses) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-lg bg-richblack-800 p-5">
      <p className="text-2xl font-bold text-richblack-5">{value}</p>
      <p className="text-xs text-richblack-300 mt-1">{label}</p>
    </div>
  )
}
