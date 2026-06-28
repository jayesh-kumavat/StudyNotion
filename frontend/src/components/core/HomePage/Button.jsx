import { Link } from "react-router-dom"
import { motion } from "framer-motion"


export default function Button({ children, active, linkto }) {
  return (
    <Link to={linkto}>
      <motion.div
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className={`rounded-xl px-6 py-3 text-center text-sm font-semibold transition-all duration-200 shadow-lg ${
          active
            ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-indigo-500/25 hover:shadow-indigo-500/40"
            : "bg-slate-800 dark:bg-slate-700 text-white border border-slate-600 shadow-slate-900/25"
        }`}
      >
        {children}
      </motion.div>
    </Link>
  )
}
