import { motion } from "framer-motion"
import { Link } from "react-router-dom"

export default function Error() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-1 flex-col items-center justify-center gap-4 py-20"
    >
      <h1 className="text-8xl font-bold gradient-text">404</h1>
      <p className="text-xl text-slate-600 dark:text-slate-400">
        Page not found
      </p>
      <Link to="/">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/25"
        >
          Go Home
        </motion.button>
      </Link>
    </motion.div>
  )
}
