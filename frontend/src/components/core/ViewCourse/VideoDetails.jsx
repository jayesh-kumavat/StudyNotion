import React, { useEffect, useRef, useState, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI"
import { updateCompletedLectures } from "../../../slices/viewCourseSlice"
import { apiConnector } from "../../../services/apiconnector"
import { courseEndpoints } from "../../../services/apis"
import IconBtn from "../../common/IconBtn"
import DiscussionPanel from "./Discussion/DiscussionPanel"
import NotesPanel from "./Notes/NotesPanel"
import LectureAssistant from "./LectureAssistant"


const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const playerRef = useRef(null)
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse)

  const [videoData, setVideoData] = useState(null)
  const [previewSource, setPreviewSource] = useState("")
  const [videoEnded, setVideoEnded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showBeginningPopup, setShowBeginningPopup] = useState(false)
  const [resumed, setResumed] = useState(false)

  // save timestamp to localStorage
  const saveToLocal = useCallback(() => {
    if (!playerRef.current || !subSectionId) return
    const currentTime = playerRef.current.currentTime
    if (currentTime > 0) {
      const key = `video-progress-${courseId}-${subSectionId}`
      localStorage.setItem(key, JSON.stringify(currentTime))
    }
  }, [courseId, subSectionId])

  // DB call to save timestamp
  const saveToDB = useCallback(async () => {
    if (!subSectionId) return
    const key = `video-progress-${courseId}-${subSectionId}`
    const saved = localStorage.getItem(key)
    const timestamp = saved ? JSON.parse(saved) : 0
    if (timestamp > 0) {
      try {
        await apiConnector("POST", courseEndpoints.SAVE_VIDEO_TIMESTAMP_API, {
          courseId, subsectionId: subSectionId, timestamp
        }, { Authorization: `Bearer ${token}` })
      } catch (e) {
        console.log("SAVE_TIMESTAMP ERROR:", e)
      }
    }
  }, [courseId, subSectionId, token])


  useEffect(() => {
    const interval = setInterval(saveToLocal, 3000)
    return () => clearInterval(interval)
  }, [saveToLocal])

  
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveToLocal()
      const key = `video-progress-${courseId}-${subSectionId}`
      const saved = localStorage.getItem(key)
      const timestamp = saved ? JSON.parse(saved) : 0

      if (timestamp > 0) {
        const data = JSON.stringify({ courseId, subsectionId: subSectionId, timestamp })
        navigator.sendBeacon(
          courseEndpoints.SAVE_VIDEO_TIMESTAMP_API + `?token=${token}`,
          new Blob([data], { type: "application/json" })
        )
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      saveToLocal()
      saveToDB()
    }
  }, [saveToLocal, saveToDB, courseId, subSectionId, token])

  // Load video
  useEffect(() => {
    if (!courseSectionData.length) return
    if (!courseId && !sectionId && !subSectionId) {
      navigate(`/dashboard/enrolled-courses`)
    } else {
      const filteredData = courseSectionData.filter(
        (course) => course._id === sectionId
      )
      const filteredVideoData = filteredData?.[0]?.subSection.filter(
        (data) => data._id === subSectionId
      )
      setVideoData(filteredVideoData?.[0] || null)
      setPreviewSource(courseEntireData.thumbnail)
      setVideoEnded(false)
      setShowBeginningPopup(false)
      setResumed(false)
    }

    // eslint-disable-next-line
  }, [courseSectionData, courseEntireData, location.pathname])


  // Fetch saved timestamp from DB and auto-resume
  useEffect(() => {
    if (!videoData?.videoUrl || !subSectionId) return
    const fetchTimestamp = async () => {
      try {
        const res = await apiConnector("POST", courseEndpoints.GET_VIDEO_TIMESTAMP_API, {
          courseId, subsectionId: subSectionId
        }, { Authorization: `Bearer ${token}` })
        const dbTime = res?.data?.success ? res.data.data : 0

        // Also check localStorage for more recent timestamp (in case user switched tabs or had connectivity issues)
        const key = `video-progress-${courseId}-${subSectionId}`
        const localSaved = localStorage.getItem(key)
        const localTime = localSaved ? JSON.parse(localSaved) : 0
        const resumeTime = Math.max(dbTime, localTime)

        if (resumeTime > 0) {
          const checkReady = setInterval(() => {
            if (playerRef.current && playerRef.current.readyState >= 1) {
              clearInterval(checkReady)
              playerRef.current.currentTime = resumeTime
              setResumed(true)
              setShowBeginningPopup(true)
              setTimeout(() => setShowBeginningPopup(false), 3000)
            }
          }, 200)
          return () => clearInterval(checkReady)
        }
      } catch (e) {
        console.log("GET_TIMESTAMP ERROR:", e)
      }
    }
    fetchTimestamp()

    // eslint-disable-next-line
  }, [videoData, subSectionId])

  const handleStartFromBeginning = () => {
    if (playerRef.current) {
      playerRef.current.currentTime = 0
      playerRef.current.play()
    }
    const key = `video-progress-${courseId}-${subSectionId}`
    localStorage.removeItem(key)
    setShowBeginningPopup(false)
  }

  const handleVideoEnded = () => {
    const key = `video-progress-${courseId}-${subSectionId}`
    localStorage.removeItem(key)
    apiConnector("POST", courseEndpoints.SAVE_VIDEO_TIMESTAMP_API, {
      courseId, subsectionId: subSectionId, timestamp: 0
    }, { Authorization: `Bearer ${token}` }).catch(() => {})
    setVideoEnded(true)
  }

  const isFirstVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )
    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)
    return currentSectionIndx === 0 && currentSubSectionIndx === 0
  }

  const goToNextVideo = () => {
    saveToLocal()
    saveToDB()
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )
    const noOfSubsections = courseSectionData[currentSectionIndx].subSection.length
    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (currentSubSectionIndx !== noOfSubsections - 1) {
      const nextSubSectionId =
        courseSectionData[currentSectionIndx].subSection[currentSubSectionIndx + 1]._id
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`)
    } else {
      const nextSectionId = courseSectionData[currentSectionIndx + 1]._id
      const nextSubSectionId = courseSectionData[currentSectionIndx + 1].subSection[0]._id
      navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`)
    }
  }

  const isLastVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const noOfSubsections = courseSectionData[currentSectionIndx].subSection.length
    
    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)
    return (
      currentSectionIndx === courseSectionData.length - 1 &&
      currentSubSectionIndx === noOfSubsections - 1
    )
  }

  const goToPrevVideo = () => {
    saveToLocal()
    saveToDB()

    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (currentSubSectionIndx !== 0) {
      const prevSubSectionId =
        courseSectionData[currentSectionIndx].subSection[currentSubSectionIndx - 1]._id
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`)
    } else {
      const prevSectionId = courseSectionData[currentSectionIndx - 1]._id
      const prevSubSectionLength = courseSectionData[currentSectionIndx - 1].subSection.length
      const prevSubSectionId =
        courseSectionData[currentSectionIndx - 1].subSection[prevSubSectionLength - 1]._id
      navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`)
    }
  }

  const handleLectureCompletion = async () => {
    setLoading(true)
    const res = await markLectureAsComplete(
      { courseId: courseId, subsectionId: subSectionId },
      token
    )
    if (res) {
      dispatch(updateCompletedLectures(subSectionId))
    }
    setLoading(false)
  }

  const handleResourceDownload = async (url, name) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const link = document.createElement("a")

      link.href = URL.createObjectURL(blob)
      link.download = name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)
    } catch (e) {
      window.open(url, "_blank")
    }
  }

  return (
    <div className="flex flex-col gap-5 text-white">
      {!videoData || !videoData.videoUrl ? (
        previewSource ? (
          <img
            src={previewSource}
            alt="Preview"
            className="h-full w-full rounded-md object-cover"
          />
        ) : (
          <div className="flex h-[400px] w-full items-center justify-center rounded-md bg-richblack-800">
            <p className="text-richblack-300">No video available</p>
          </div>
        )
      ) : (
        <div className="relative w-full">
          <video
            ref={playerRef}
            key={subSectionId}
            src={videoData.videoUrl}
            className="w-full aspect-video rounded-md bg-black"
            controls
            controlsList="nodownload"
            playsInline
            onEnded={handleVideoEnded}
          />

          {/* Popup to start from beginning */}
          {showBeginningPopup && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[110] flex items-center gap-3 rounded-lg bg-richblack-800/95 border border-richblack-600 px-4 py-3 shadow-lg backdrop-blur-sm animate-fade-in">
              <p className="text-sm text-richblack-5">Resuming where you left off</p>
              <button
                onClick={handleStartFromBeginning}
                className="rounded bg-yellow-50 px-3 py-1 text-xs font-semibold text-richblack-900 hover:bg-yellow-100"
              >
                Start from Beginning
              </button>
              <button
                onClick={() => setShowBeginningPopup(false)}
                className="ml-1 text-richblack-300 hover:text-richblack-5 text-lg leading-none"
              >
                ×
              </button>
            </div>
          )}

          {/* Overlay when video ends */}
          {videoEnded && (
            <div
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1))",
              }}
              className="absolute inset-0 z-[100] grid h-full w-full place-content-center font-inter"
            >
              {!completedLectures.includes(subSectionId) && (
                <IconBtn
                  disabled={loading}
                  onclick={() => handleLectureCompletion()}
                  text={!loading ? "Mark As Completed" : "Loading..."}
                  customClasses="text-xl max-w-max px-4 mx-auto"
                />
              )}
              <IconBtn
                disabled={loading}
                onclick={() => {
                  if (playerRef?.current) {
                    playerRef.current.currentTime = 0
                    playerRef.current.play()
                    setVideoEnded(false)
                  }
                }}
                text="Rewatch"
                customClasses="text-xl max-w-max px-4 mx-auto mt-2"
              />
              <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                {!isFirstVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToPrevVideo}
                    className="blackButton"
                  >
                    Prev
                  </button>
                )}
                {!isLastVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToNextVideo}
                    className="blackButton"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <h1 className="mt-4 text-3xl font-semibold">{videoData?.title}</h1>
      <p className="pt-2 pb-6">{videoData?.description}</p>

      {/* Resources */}
      {videoData?.resources?.length > 0 && (
        <div className="mb-4 rounded-lg bg-richblack-800 p-4">
          <h3 className="text-lg font-semibold text-richblack-5 mb-3">Resources</h3>
          <div className="flex flex-col gap-2">
            {videoData.resources.map((res, i) => (
              <button
                key={i}
                onClick={() => handleResourceDownload(res.url, res.name)}
                className="flex items-center gap-2 text-sm text-caribbeangreen-100 hover:text-caribbeangreen-50 text-left"
              >
                📄 {res.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      <NotesPanel playerRef={playerRef} />

      {/* AI Assistant */}
      <LectureAssistant />

      {/* Discussion section */}
      {courseId && <DiscussionPanel courseId={courseId} />}
    </div>
  )
}

export default VideoDetails
