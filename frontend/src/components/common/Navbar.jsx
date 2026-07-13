import { useEffect, useState } from "react"
import { Link, matchPath, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import { motion } from "framer-motion"
import { AiOutlineShoppingCart } from "react-icons/ai"
import logo from "../../assets/Logo/Logo-Full-Light.png"
import logoDark from "../../assets/Logo/Logo-Full-Dark.png"
import { NavbarLinks } from "../../data/navbar-links"
import { apiConnector } from "../../services/apiconnector"
import { categories } from "../../services/apis"
import { ACCOUNT_TYPE } from "../../utils/constants"
import ProfileDropDown from "../core/Auth/ProfileDropDown"
import ThemeToggle from "../ui/ThemeToggle"
import { useTheme } from "../../context/ThemeContext"


function Navbar() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { totalItems } = useSelector((state) => state.cart)
  const location = useLocation()
  const { theme } = useTheme()

  const [subLinks, setSubLinks] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        setSubLinks(res?.data?.data || [])
      } catch (error) {
        console.log("Could not fetch Categories.", error)
      }
      setLoading(false)
    })()
  }, [])

  const matchRoute = (route) => matchPath({ path: route }, location.pathname)

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 glass border-b border-slate-200 dark:border-slate-700"
    >
      <div className="flex h-16 items-center justify-between w-11/12 max-w-maxContent mx-auto">
        {/* Logo */}
        <Link to="/">
          <img
            src={theme === "dark" ? logo : logoDark}
            alt="Logo"
            width={160}
            height={32}
            loading="lazy"
          />
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:block">
          <ul className="flex gap-x-6">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <div className="group relative cursor-pointer">
                    <Link to="/catalog" className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                      matchRoute("/catalog/:catalogName") || matchRoute("/catalog")
                        ? "text-indigo-500"
                        : "text-slate-600 dark:text-slate-300 hover:text-indigo-500"
                    }`}>
                      {link.title}
                      <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Link>
                    <div className="invisible absolute left-1/2 top-full -translate-x-1/2 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                      <div className="glass-card p-4 min-w-[200px] space-y-2">
                        {loading ? (
                          <p className="text-center text-sm text-slate-500">Loading...</p>
                        ) : subLinks?.length ? (
                          subLinks.map((subLink, i) => (
                            <Link
                              to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`}
                              className="block px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors"
                              key={i}
                            >
                              {subLink.name}
                            </Link>
                          ))
                        ) : (
                          <p className="text-center text-sm text-slate-500">No Categories</p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link to={link?.path}>
                    <p className={`text-sm font-medium transition-colors ${
                      matchRoute(link?.path)
                        ? "text-indigo-500"
                        : "text-slate-600 dark:text-slate-300 hover:text-indigo-500"
                    }`}>
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-x-3">
          <ThemeToggle />

          {user && user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-slate-600 dark:text-slate-300" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-indigo-500 text-[10px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {token === null && (
            <div className="flex gap-x-2">
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Log in
                </motion.button>
              </Link>
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                >
                  Sign up
                </motion.button>
              </Link>
            </div>
          )}

          {token !== null && <ProfileDropDown />}
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar
