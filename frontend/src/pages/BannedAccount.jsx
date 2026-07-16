import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { MdBlock } from "react-icons/md"

const SUPPORT_EMAIL = process.env.REACT_APP_SUPPORT_EMAIL || "support@studynotion.com"

export default function BannedAccount() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-1 flex-col items-center justify-center gap-6 py-20 text-center px-4"
    >
      <MdBlock className="text-8xl text-red-500" />
      <h1 className="text-4xl font-bold text-richblack-5">Account Banned</h1>
      <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md">
        Your account has been banned by the admin and you no longer have access to StudyNotion.
      </p>
      <p className="text-slate-500 dark:text-slate-400">
        If you believe this is a mistake, please contact our support team at{" "}
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="text-yellow-400 hover:underline font-medium"
        >
          {SUPPORT_EMAIL}
        </a>
      </p>
      <Link to="/">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/25"
        >
          Go Home
        </motion.button>
      </Link>
    </motion.div>
  )
}
