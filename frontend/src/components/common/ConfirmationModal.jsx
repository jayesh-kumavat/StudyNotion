import { motion, AnimatePresence } from "framer-motion"
import IconBtn from "./IconBtn"



export default function ConfirmationModal({ modalData }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1000] grid place-items-center overflow-auto bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="w-11/12 max-w-[350px] rounded-2xl glass-card p-6"
        >
          <p className="text-xl font-bold text-slate-900 dark:text-white">
            {modalData?.text1}
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {modalData?.text2}
          </p>
          <div className="mt-6 flex items-center gap-x-4">
            <IconBtn
              onclick={modalData?.btn1Handler}
              text={modalData?.btn1Text}
            />
            <button
              className="rounded-xl px-5 py-2.5 text-sm font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              onClick={modalData?.btn2Handler}
            >
              {modalData?.btn2Text}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
