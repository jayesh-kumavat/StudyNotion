import { Link } from "react-router-dom"
import Logo from "../../assets/Logo/Logo-Full-Light.png"
import LogoDark from "../../assets/Logo/Logo-Full-Dark.png"
import { useTheme } from "../../context/ThemeContext"

const BottomFooter = ["Privacy Policy", "Cookie Policy", "Terms"]

export default function Footer() {
  const { theme } = useTheme()

  return (
    <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
      <div className="w-11/12 max-w-maxContent mx-auto py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/">
            <img
              src={theme === "dark" ? Logo : LogoDark}
              alt="StudyNotion"
              className="h-8"
            />
          </Link>
          <div className="flex gap-6">
            {["About", "Contact", "Catalog"].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-500 transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex gap-4">
            {BottomFooter.map((item, i) => (
              <p key={i} className="text-xs text-slate-500 dark:text-slate-500 cursor-pointer hover:text-indigo-500 transition-colors">
                {item}
              </p>
            ))}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-500">
            © {new Date().getFullYear()} StudyNotion. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
