import { useEffect, useState, useCallback, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate, useLocation } from "react-router-dom"
import { apiConnector } from "../../services/apiconnector"
import { endpoints } from "../../services/apis"
import { setToken } from "../../slices/authSlice"
import { logout } from "../../services/operations/authAPI"

const INACTIVITY_TIMEOUT = 60 * 60 * 1000 // 1 hour
const WARNING_BEFORE = 2 * 60 * 1000 // show warning 2 minutes before timeout

export default function SessionExpiryWarning() {
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPopup, setShowPopup] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const lastActivityRef = useRef(Date.now())
  const timerRef = useRef(null)
  const countdownRef = useRef(null)

  const handleLogout = useCallback(() => {
    setShowPopup(false)
    clearInterval(countdownRef.current)
    dispatch(logout(navigate))
  }, [dispatch, navigate])

  const refreshToken = useCallback(async () => {
    try {
      const res = await apiConnector("POST", endpoints.REFRESH_TOKEN_API, null, {
        Authorization: `Bearer ${token}`,
      })
      if (res?.data?.success) {
        dispatch(setToken(res.data.token))
        localStorage.setItem("token", JSON.stringify(res.data.token))
      }
    } catch (e) {
      // token already expired, force logout
      handleLogout()
    }
  }, [token, dispatch, handleLogout])

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now()
    if (showPopup) {
      setShowPopup(false)
      clearInterval(countdownRef.current)
    }
  }, [showPopup])

  // track user activity
  useEffect(() => {
    if (!token) return

    const events = ["mousedown", "keydown", "scroll", "touchstart", "mousemove"]
    const handleActivity = () => {
      lastActivityRef.current = Date.now()
      if (showPopup) {
        // user interacted while popup is showing — extend session
        resetTimer()
        refreshToken()
      }
    }

    // track video playing as activity
    const checkVideoPlaying = setInterval(() => {
      const videos = document.querySelectorAll("video")
      for (const video of videos) {
        if (!video.paused && !video.ended) {
          lastActivityRef.current = Date.now()
          break
        }
      }
    }, 30000)

    events.forEach((e) => window.addEventListener(e, handleActivity))
    return () => {
      events.forEach((e) => window.removeEventListener(e, handleActivity))
      clearInterval(checkVideoPlaying)
    }
  }, [token, showPopup, resetTimer, refreshToken])

  // reset timer on page navigation
  useEffect(() => {
    if (!token) return
    lastActivityRef.current = Date.now()
  }, [location.pathname, token])

  // silently refresh token every 50 minutes if user is active
  useEffect(() => {
    if (!token) return
    const refreshInterval = setInterval(() => {
      const inactiveFor = Date.now() - lastActivityRef.current
      if (inactiveFor < INACTIVITY_TIMEOUT - WARNING_BEFORE) {
        // User is active, refresh token silently
        refreshToken()
      }
    }, 50 * 60 * 1000)
    return () => clearInterval(refreshInterval)
  }, [token, refreshToken])

  // check inactivity
  useEffect(() => {
    if (!token) return

    timerRef.current = setInterval(() => {
      const inactiveFor = Date.now() - lastActivityRef.current
      const remaining = INACTIVITY_TIMEOUT - inactiveFor

      if (remaining <= 0) {
        clearInterval(timerRef.current)
        clearInterval(countdownRef.current)
        handleLogout()
      } else if (remaining <= WARNING_BEFORE && !showPopup) {
        // Show warning
        setShowPopup(true)
        setTimeLeft(Math.floor(remaining / 1000))
        countdownRef.current = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(countdownRef.current)
              handleLogout()
              return 0
            }
            return prev - 1
          })
        }, 1000)
      }
    }, 1000)

    return () => {
      clearInterval(timerRef.current)
      clearInterval(countdownRef.current)
    }
  }, [token, handleLogout, showPopup])

  const handleStayLoggedIn = () => {
    resetTimer()
    refreshToken()
  }

  if (!showPopup || !token) return null

  return (
    <div className="fixed inset-0 z-[1000] grid place-items-center bg-black/50 backdrop-blur-sm">
      <div className="w-11/12 max-w-[400px] rounded-lg bg-richblack-800 border border-richblack-600 p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-richblack-5 mb-2">
          Are you still there?
        </h2>
        <p className="text-richblack-300 text-sm mb-4">
          You've been inactive. Your session will expire in{" "}
          <span className="text-yellow-50 font-bold">
            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
          </span>
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleStayLoggedIn}
            className="flex-1 rounded-md bg-yellow-50 py-2 px-4 font-semibold text-richblack-900 hover:bg-yellow-100 transition-colors"
          >
            I'm still here
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 rounded-md bg-richblack-600 py-2 px-4 font-semibold text-richblack-5 hover:bg-richblack-500 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
