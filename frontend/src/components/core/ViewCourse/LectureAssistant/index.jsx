import { useState, useRef, useEffect } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { apiConnector } from "../../../../services/apiconnector"
import { lectureAssistantEndpoints } from "../../../../services/apis"
import ReactMarkdown from "react-markdown"

const QUICK_PROMPTS = [
  { label: "Summarize", icon: "📝", prompt: "Summarize this lecture in 5 key points" },
  { label: "Quiz", icon: "❓", prompt: "Generate a 5-question quiz for this lecture with answers" },
  { label: "Key Concepts", icon: "💡", prompt: "What are the key concepts covered in this lecture?" },
  { label: "Explain Simply", icon: "🔰", prompt: "Explain this lecture's topic in simple terms for a beginner" },
]


export default function LectureAssistant() {
  const { subSectionId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [hasTranscript, setHasTranscript] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => {
    setMessages([])
    checkTranscript()
    // eslint-disable-next-line
  }, [subSectionId])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const checkTranscript = async () => {
    try {
      const res = await apiConnector("POST", lectureAssistantEndpoints.GET_TRANSCRIPT_API, {
        subsectionId: subSectionId,
      }, { Authorization: `Bearer ${token}` })
      if (res?.data?.success) {
        setHasTranscript(res.data.hasTranscript)
      }
    } catch (e) {}
  }

  const handleSend = async (question) => {
    const q = question || input.trim()
    if (!q || loading) return

    const newMessages = [...messages, { role: "user", content: q }]
    setMessages(newMessages)
    setInput("")
    setLoading(true)

    try {
      const res = await apiConnector("POST", lectureAssistantEndpoints.ASK_AI_API, {
        subsectionId: subSectionId,
        question: q,
        chatHistory: newMessages.slice(-6),
      }, { Authorization: `Bearer ${token}` })

      if (res?.data?.success) {
        setMessages([...newMessages, { role: "assistant", content: res.data.data }])
        if (!hasTranscript) setHasTranscript(true)
      } else {
        setMessages([...newMessages, { role: "assistant", content: "Sorry, I couldn't process that. Try again." }])
      }
    } catch (e) {
      setMessages([...newMessages, { role: "assistant", content: "Error connecting to AI. Please try again." }])
    }
    setLoading(false)
  }

  return (
    <div className="mt-6 rounded-xl bg-richblack-800 border border-richblack-700 overflow-hidden">

      {/* Header - clickable to toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-richblack-700 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🤖</span>
          <div className="text-left">
            <h3 className="text-base font-semibold text-richblack-5">AI Lecture Assistant</h3>
            <p className="text-xs text-richblack-300">
              {hasTranscript ? "Transcript ready • Ask anything about this lecture" : "Ask questions about this lecture"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasTranscript && (
            <span className="text-[10px] bg-caribbeangreen-100/10 text-caribbeangreen-100 px-2 py-0.5 rounded-full border border-caribbeangreen-100/20">
              ✓ Transcript
            </span>
          )}
          <span className={`text-richblack-300 transition-transform ${isOpen ? "rotate-180" : ""}`}>
            ▼
          </span>
        </div>
      </button>

      {/* Collapsible content */}
      {isOpen && (
        <div className="border-t border-richblack-700 p-4">
          
          {/* Quick prompts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {QUICK_PROMPTS.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSend(qp.prompt)}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-richblack-700 border border-richblack-600 px-3 py-2 text-xs text-richblack-25 hover:border-yellow-50 hover:text-yellow-50 transition-all disabled:opacity-50"
              >
                <span>{qp.icon}</span>
                <span>{qp.label}</span>
              </button>
            ))}
          </div>

          {/* Chat messages */}
          <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto mb-4 scrollbar-hide rounded-lg bg-richblack-900 p-3">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <span className="text-4xl mb-3">💬</span>
                <p className="text-richblack-300 text-sm">
                  Ask anything about this lecture
                </p>
                <p className="text-richblack-400 text-xs mt-1">
                  Summaries, explanations, quizzes, or clear your doubts
                </p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm ${
                    msg.role === "user"
                      ? "bg-yellow-50 text-richblack-900"
                      : "bg-richblack-700 text-richblack-25 border border-richblack-600"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-invert prose-sm max-w-none [&>p]:mb-2 [&>ul]:mb-2 [&>ol]:mb-2">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p>{msg.content}</p>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-richblack-700 rounded-xl px-4 py-3 border border-richblack-600">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-richblack-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-2 h-2 bg-richblack-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-2 h-2 bg-richblack-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your question..."
              disabled={loading}
              className="flex-1 rounded-lg bg-richblack-700 px-4 py-2.5 text-sm text-richblack-5 outline-none border border-richblack-600 focus:border-yellow-50 transition-colors disabled:opacity-50 placeholder:text-richblack-400"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="rounded-lg bg-yellow-50 px-5 py-2.5 text-sm font-semibold text-richblack-900 hover:bg-yellow-100 transition-colors disabled:opacity-50 disabled:hover:bg-yellow-50"
            >
              Ask
            </button>
          </div>

          {!hasTranscript && messages.length === 0 && (
            <p className="text-[11px] text-richblack-400 mt-3 text-center">
              First question may take longer as transcript is generated automatically
            </p>
          )}
        </div>
      )}
    </div>
  )
}
