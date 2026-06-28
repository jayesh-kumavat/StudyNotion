import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import {
  getUserLearningPaths,
  generateLearningPath,
  deleteLearningPath,
} from "../../../../services/operations/learningPathAPI"


export default function LearningPaths() {
  const { token } = useSelector((state) => state.auth)
  const [paths, setPaths] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    interests: "",
    skillLevel: "beginner",
  })

  useEffect(() => {
    fetchPaths()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchPaths = async () => {
    setLoading(true)
    const result = await getUserLearningPaths(token)
    setPaths(result)
    setLoading(false)
  }

  const handleGenerate = async (e) => {
    e.preventDefault()
    const data = {
      title: formData.title,
      interests: formData.interests
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean),
      skillLevel: formData.skillLevel,
    }

    const result = await generateLearningPath(data, token)
    if (result) {
      setShowForm(false)
      setFormData({ title: "", interests: "", skillLevel: "beginner" })
      fetchPaths()
    }
  }

  const handleDelete = async (pathId) => {
    await deleteLearningPath(pathId, token)
    fetchPaths()
  }

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="text-richblack-5">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-medium">My Learning Paths</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-md bg-yellow-50 px-5 py-2 font-semibold text-richblack-900"
        >
          {showForm ? "Cancel" : "+ Create Path"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleGenerate}
          className="mb-8 rounded-lg bg-richblack-800 p-6 flex flex-col gap-4"
        >
          <input
            type="text"
            placeholder="Path title (e.g., Full Stack Developer)"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="rounded-md bg-richblack-700 p-3 text-richblack-5 outline-none"
            required
          />
          <input
            type="text"
            placeholder="Interests (comma separated, e.g., React, Node.js, MongoDB)"
            value={formData.interests}
            onChange={(e) =>
              setFormData({ ...formData, interests: e.target.value })
            }
            className="rounded-md bg-richblack-700 p-3 text-richblack-5 outline-none"
            required
          />
          <select
            value={formData.skillLevel}
            onChange={(e) =>
              setFormData({ ...formData, skillLevel: e.target.value })
            }
            className="rounded-md bg-richblack-700 p-3 text-richblack-5 outline-none"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <button
            type="submit"
            className="rounded-md bg-yellow-50 px-5 py-2 font-semibold text-richblack-900 w-fit"
          >
            Generate Path
          </button>
        </form>
      )}

      {/* paths list */}
      {paths.length === 0 ? (
        <p className="text-center text-richblack-300 py-10">
          No learning paths yet. Create one based on your interests!
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {paths.map((path) => (
            <div key={path._id} className="rounded-lg bg-richblack-800 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{path.title}</h2>
                  <p className="text-sm text-richblack-300 mt-1">
                    {path.description}
                  </p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {path.interests?.map((interest, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-richblack-700 px-3 py-1 text-xs text-yellow-50"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(path._id)}
                  className="text-pink-200 text-sm hover:underline"
                >
                  Remove
                </button>
              </div>

              {/* progress */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-richblack-300 mb-1">
                  <span>Progress</span>
                  <span>{path.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-richblack-700">
                  <div
                    className="h-2 rounded-full bg-caribbeangreen-100 transition-all"
                    style={{ width: `${path.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* courses in path */}
              <div className="flex flex-col gap-2">
                {path.courses?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-md bg-richblack-700 p-3"
                  >
                    <span className="text-richblack-300 text-sm w-6">
                      {item.order}.
                    </span>
                    <img
                      src={item.courseId?.thumbnail}
                      alt=""
                      className="h-10 w-14 rounded object-cover"
                    />
                    <span className="flex-1 text-sm">
                      {item.courseId?.courseName || "Course"}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        item.status === "completed"
                          ? "bg-caribbeangreen-100 text-richblack-900"
                          : item.status === "in_progress"
                          ? "bg-yellow-50 text-richblack-900"
                          : "bg-richblack-600 text-richblack-200"
                      }`}
                    >
                      {item.status.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
