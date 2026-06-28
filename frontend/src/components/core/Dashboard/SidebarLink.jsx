import * as Icons from "react-icons/vsc"
import { useDispatch } from "react-redux"
import { NavLink, matchPath, useLocation } from "react-router-dom"
import { motion } from "framer-motion"

import { resetCourseState } from "../../../slices/courseSlice"


export default function SidebarLink({ link, iconName }) {
  const Icon = Icons[iconName]
  const location = useLocation()
  const dispatch = useDispatch()

  const matchRoute = (route) => matchPath({ path: route }, location.pathname)
  const isActive = matchRoute(link.path)

  return (
    <NavLink
      to={link.path}
      onClick={() => dispatch(resetCourseState())}
      className="relative px-8 py-2.5 text-sm font-medium transition-all duration-200"
    >
      {isActive && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute inset-0 bg-indigo-50 dark:bg-indigo-500/10 rounded-r-xl border-l-[3px] border-indigo-500"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      <div className={`relative flex items-center gap-x-2 ${
        isActive
          ? "text-indigo-600 dark:text-indigo-400"
          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
      }`}>
        {Icon && <Icon className="text-lg" />}
        <span>{link.name}</span>
      </div>
    </NavLink>
  )
}
