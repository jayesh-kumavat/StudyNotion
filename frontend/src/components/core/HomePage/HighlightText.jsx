export default function HighlightText({ text }) {
  return (
    <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-bold">
      {" "}{text}
    </span>
  )
}
