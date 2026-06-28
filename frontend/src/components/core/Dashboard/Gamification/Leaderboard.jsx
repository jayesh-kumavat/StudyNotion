import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { getLeaderboard, getGamificationProfile } from "../../../../services/operations/gamificationAPI"
import { apiConnector } from "../../../../services/apiconnector"

const SYNC_POINTS_API = process.env.REACT_APP_BASE_URL + "/course/syncPoints"


export default function Leaderboard() {
  const { token } = useSelector((state) => state.auth)
  const [leaderboard, setLeaderboard] = useState([])
  const [myProfile, setMyProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      
      // Sync points for existing progress (one-time)
      await apiConnector("POST", SYNC_POINTS_API, null, {
        Authorization: `Bearer ${token}`,
      }).catch(() => {})

      const [board, profile] = await Promise.all([
        getLeaderboard(),
        getGamificationProfile(token),
      ])
      setLeaderboard(board)
      setMyProfile(profile)
      setLoading(false)
    }
    fetchData()
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
    <div className="text-richblack-5">
      <h1 className="mb-8 text-3xl font-medium text-richblack-5">
        Leaderboard
      </h1>

      {/* my stats cards */}
      {myProfile && (
        <div className="mb-8 flex gap-6 flex-wrap">
          <div className="rounded-lg bg-richblack-800 p-6 flex flex-col items-center min-w-[150px]">
            <p className="text-3xl font-bold text-yellow-50">
              {myProfile.points}
            </p>
            <p className="text-richblack-300 text-sm mt-1">Your Points</p>
          </div>
        </div>
      )}

      {/* leaderboard table */}
      <div className="rounded-lg bg-richblack-800 overflow-hidden">
        <div className="grid grid-cols-[60px_1fr_120px] gap-4 p-4 border-b border-richblack-700 text-richblack-300 text-sm font-semibold">
          <span>Rank</span>
          <span>Student</span>
          <span className="text-right">Points</span>
        </div>

        {leaderboard.length === 0 ? (
          <p className="p-6 text-center text-richblack-300">
            No entries yet. Start learning to earn points!
          </p>
        ) : (
          leaderboard.map((entry, index) => (
            <div
              key={entry._id}
              className={`grid grid-cols-[60px_1fr_120px] gap-4 p-4 items-center border-b border-richblack-700 ${
                index < 3 ? "bg-richblack-700" : ""
              }`}
            >
              <span className="text-lg font-bold">
                {index === 0
                  ? "🥇"
                  : index === 1
                  ? "🥈"
                  : index === 2
                  ? "🥉"
                  : `#${index + 1}`}
              </span>
              <div className="flex items-center gap-3">
                <img
                  src={
                    entry.userId?.image ||
                    `https://api.dicebear.com/5.x/initials/svg?seed=${entry.userId?.firstName}`
                  }
                  alt=""
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span>
                  {entry.userId?.firstName} {entry.userId?.lastName}
                </span>
              </div>
              <span className="text-right font-semibold text-yellow-50">
                {entry.points}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
