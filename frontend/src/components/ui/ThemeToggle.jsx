import { useTheme } from "../../context/ThemeContext"
import { HiSun, HiMoon } from "react-icons/hi"


export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-richblack-700 hover:bg-richblack-600 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <HiMoon className="w-5 h-5 text-blue-300" />
      ) : (
        <HiSun className="w-5 h-5 text-yellow-400" />
      )}
    </button>
  )
}
