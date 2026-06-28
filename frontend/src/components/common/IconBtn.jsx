import { motion } from "framer-motion"


export default function IconBtn({
  text,
  onclick,
  children,
  disabled,
  outline = false,
  customClasses,
  type,
}) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      disabled={disabled}
      onClick={onclick}
      className={`flex items-center gap-x-2 rounded-xl px-5 py-2.5 font-semibold text-sm transition-all duration-200
        ${outline
          ? "border-2 border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white"
          : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${customClasses || ""}`}
      type={type}
    >
      {children ? (
        <>
          <span>{text}</span>
          {children}
        </>
      ) : (
        text
      )}
    </motion.button>
  )
}
