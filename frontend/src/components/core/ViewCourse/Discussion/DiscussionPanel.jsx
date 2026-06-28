import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { BiLike, BiSolidLike } from "react-icons/bi"
import { createDiscussion, getCourseDiscussions, addReply, toggleLikeDiscussion, deleteDiscussion } from "../../../../services/operations/discussionAPI"


export default function DiscussionPanel({ courseId }) {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const [discussions, setDiscussions] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [replyText, setReplyText] = useState({})
  const [activeReply, setActiveReply] = useState(null)

  useEffect(() => {
    if (courseId) fetchDiscussions()

    // eslint-disable-next-line
  }, [courseId])

  const fetchDiscussions = async () => {
    const result = await getCourseDiscussions(courseId, token)
    setDiscussions(result)
  }

  const handlePost = async (e) => {
    e.preventDefault()
    if (!title || !message) return

    const result = await createDiscussion({ courseId, title, message }, token)
    if (result) {
      setTitle("")
      setMessage("")
      setShowForm(false)
      fetchDiscussions()
    }
  }

  const handleReply = async (discussionId) => {
    if (!replyText[discussionId]) return
    const result = await addReply(
      { discussionId, message: replyText[discussionId] },
      token
    )
    if (result) {
      setReplyText({ ...replyText, [discussionId]: "" })
      setActiveReply(null)
      fetchDiscussions()
    }
  }

  const handleLike = async (discussionId) => {
    await toggleLikeDiscussion(discussionId, token)
    fetchDiscussions()
  }

  const handleDelete = async (discussionId) => {
    const result = await deleteDiscussion(discussionId, token)
    if (result) fetchDiscussions()
  }

  return (
    <div className="text-white p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Discussions</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded bg-yellow-50 px-3 py-1 text-sm font-semibold text-richblack-900"
        >
          {showForm ? "Cancel" : "New Post"}
        </button>
      </div>

      {/* new discussion form */}
      {showForm && (
        <form onSubmit={handlePost} className="mb-6 flex flex-col gap-3 bg-richblack-800 p-4 rounded-lg">
          <input
            type="text"
            placeholder="Discussion title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded bg-richblack-700 p-2 text-sm outline-none"
            required
          />
          <textarea
            placeholder="What's on your mind?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="rounded bg-richblack-700 p-2 text-sm outline-none min-h-[80px] resize-none"
            required
          />
          <button
            type="submit"
            className="rounded bg-yellow-50 px-4 py-2 text-sm font-semibold text-richblack-900 w-fit"
          >
            Post
          </button>
        </form>
      )}

      {/* discussions list */}
      <div className="flex flex-col gap-4">
        {discussions.length === 0 ? (
          <p className="text-center text-richblack-300 py-6">
            No discussions yet. Start the conversation!
          </p>
        ) : (
          discussions.map((disc) => (
            <div key={disc._id} className="rounded-lg bg-richblack-800 p-4">
              {/* user info */}
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={disc.user?.image || `https://api.dicebear.com/5.x/initials/svg?seed=${disc.user?.firstName}`}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold">
                    {disc.user?.firstName} {disc.user?.lastName}
                  </p>
                  <p className="text-xs text-richblack-400">
                    {new Date(disc.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <h3 className="font-semibold mb-1">{disc.title}</h3>
              <p className="text-sm text-richblack-100 mb-3">{disc.message}</p>

              {/* like & reply & delete buttons */}
              <div className="flex items-center gap-4 text-sm text-richblack-300">
                <button
                  onClick={() => handleLike(disc._id)}
                  className="flex items-center gap-1 hover:text-yellow-50"
                >
                  {disc.likes?.includes(user?._id) ? (
                    <BiSolidLike className="text-yellow-50" />
                  ) : (
                    <BiLike />
                  )}
                  {disc.likes?.length || 0}
                </button>
                <button
                  onClick={() => setActiveReply(activeReply === disc._id ? null : disc._id)}
                  className="hover:text-yellow-50"
                >
                  Reply ({disc.replies?.length || 0})
                </button>
                {disc.user?._id === user?._id && (
                  <button
                    onClick={() => handleDelete(disc._id)}
                    className="hover:text-pink-200"
                  >
                    Delete
                  </button>
                )}
              </div>

              {/* replies */}
              {disc.replies?.length > 0 && (
                <div className="mt-3 ml-6 flex flex-col gap-2">
                  {disc.replies.map((reply, i) => (
                    <div key={i} className="rounded bg-richblack-700 p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <img
                          src={reply.user?.image || `https://api.dicebear.com/5.x/initials/svg?seed=${reply.user?.firstName}`}
                          alt=""
                          className="h-6 w-6 rounded-full object-cover"
                        />
                        <span className="text-xs font-semibold">
                          {reply.user?.firstName} {reply.user?.lastName}
                        </span>
                      </div>
                      <p className="text-xs text-richblack-100">{reply.message}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* reply input */}
              {activeReply === disc._id && (
                <div className="mt-3 ml-6 flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a reply..."
                    value={replyText[disc._id] || ""}
                    onChange={(e) => setReplyText({ ...replyText, [disc._id]: e.target.value })}
                    className="flex-1 rounded bg-richblack-700 p-2 text-sm outline-none"
                  />
                  <button
                    onClick={() => handleReply(disc._id)}
                    className="rounded bg-yellow-50 px-3 py-1 text-sm font-semibold text-richblack-900"
                  >
                    Send
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
