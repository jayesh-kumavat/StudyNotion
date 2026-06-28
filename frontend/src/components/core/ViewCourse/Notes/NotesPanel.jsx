import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { RiDeleteBin6Line } from "react-icons/ri"
import { MdEdit } from "react-icons/md"
import { apiConnector } from "../../../../services/apiconnector"
import { featuresEndpoints } from "../../../../services/apis"
import { toast } from "react-hot-toast"



export default function NotesPanel({ playerRef }) {
  const { courseId, subSectionId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const [notes, setNotes] = useState([])
  const [content, setContent] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [editContent, setEditContent] = useState("")

  useEffect(() => {
    if (courseId && subSectionId) fetchNotes()
    
    // eslint-disable-next-line
  }, [courseId, subSectionId])

  const fetchNotes = async () => {
    try {
      const res = await apiConnector("POST", featuresEndpoints.GET_NOTES_API, {
        courseId, subsectionId: subSectionId,
      }, { Authorization: `Bearer ${token}` })
      if (res?.data?.success) setNotes(res.data.data)
    } catch (e) { console.log("FETCH NOTES ERROR", e) }
  }

  const handleAdd = async () => {
    if (!content.trim()) return
    const timestamp = playerRef?.current ? Math.floor(playerRef.current.currentTime) : 0
    try {
      const res = await apiConnector("POST", featuresEndpoints.CREATE_NOTE_API, {
        courseId, subsectionId: subSectionId, timestamp, content,
      }, { Authorization: `Bearer ${token}` })
      if (res?.data?.success) {
        setNotes([...notes, res.data.data])
        setContent("")
        toast.success("Note added")
      }
    } catch (e) { toast.error("Failed to add note") }
  }

  const handleUpdate = async (noteId) => {
    if (!editContent.trim()) return
    try {
      const res = await apiConnector("POST", featuresEndpoints.UPDATE_NOTE_API, {
        noteId, content: editContent,
      }, { Authorization: `Bearer ${token}` })
      if (res?.data?.success) {
        setNotes(notes.map((n) => n._id === noteId ? res.data.data : n))
        setEditingId(null)
        toast.success("Note updated")
      }
    } catch (e) { toast.error("Failed to update note") }
  }

  const handleDelete = async (noteId) => {
    try {
      const res = await apiConnector("POST", featuresEndpoints.DELETE_NOTE_API, {
        noteId,
      }, { Authorization: `Bearer ${token}` })
      if (res?.data?.success) {
        setNotes(notes.filter((n) => n._id !== noteId))
        toast.success("Note deleted")
      }
    } catch (e) { toast.error("Failed to delete note") }
  }

  const seekToTimestamp = (timestamp) => {
    if (playerRef?.current) {
      playerRef.current.currentTime = timestamp
      playerRef.current.play()
    }
  }

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${String(s).padStart(2, "0")}`
  }

  return (
    <div className="mt-4 rounded-lg bg-richblack-800 p-4">
      <h3 className="text-lg font-semibold text-richblack-5 mb-3">My Notes</h3>

      {/* Add note */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Add a note at current timestamp..."
          className="flex-1 rounded bg-richblack-700 px-3 py-2 text-sm text-richblack-5 outline-none border border-richblack-600 focus:border-yellow-50"
        />
        <button
          onClick={handleAdd}
          className="rounded bg-yellow-50 px-4 py-2 text-sm font-semibold text-richblack-900 hover:bg-yellow-100"
        >
          Add
        </button>
      </div>

      {/* Notes list */}
      {notes.length === 0 ? (
        <p className="text-sm text-richblack-300">No notes yet. Add one while watching!</p>
      ) : (
        <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
          {notes.map((note) => (
            <div key={note._id} className="flex items-start gap-3 rounded bg-richblack-700 p-3">
              <button
                onClick={() => seekToTimestamp(note.timestamp)}
                className="text-xs text-yellow-50 font-mono bg-richblack-600 px-2 py-1 rounded hover:bg-richblack-500 flex-shrink-0"
              >
                {formatTime(note.timestamp)}
              </button>
              <div className="flex-1">
                {editingId === note._id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleUpdate(note._id)}
                      className="flex-1 rounded bg-richblack-600 px-2 py-1 text-sm text-richblack-5 outline-none"
                      autoFocus
                    />
                    <button onClick={() => handleUpdate(note._id)} className="text-xs text-caribbeangreen-100">Save</button>
                    <button onClick={() => setEditingId(null)} className="text-xs text-richblack-300">Cancel</button>
                  </div>
                ) : (
                  <p className="text-sm text-richblack-25">{note.content}</p>
                )}
              </div>
              {editingId !== note._id && (
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => { setEditingId(note._id); setEditContent(note.content) }}>
                    <MdEdit className="text-richblack-300 hover:text-yellow-50" size={14} />
                  </button>
                  <button onClick={() => handleDelete(note._id)}>
                    <RiDeleteBin6Line className="text-richblack-300 hover:text-pink-200" size={14} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
