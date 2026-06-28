import { useState } from "react"
import { toast } from "react-hot-toast"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { sendOtp } from "../../../services/operations/authAPI"
import { setSignupData } from "../../../slices/authSlice"
import { ACCOUNT_TYPE } from "../../../utils/constants"



function SignupForm() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [accountType, setAccountType] = useState(ACCOUNT_TYPE.STUDENT)

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", password: "", confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { firstName, lastName, email, password, confirmPassword } = formData

  const handleOnChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error("Passwords Do Not Match")
      return
    }
    const signupData = { ...formData, accountType }
    dispatch(setSignupData(signupData))
    dispatch(sendOtp(formData.email, navigate))
    setFormData({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" })
    setAccountType(ACCOUNT_TYPE.STUDENT)
  }

  const tabData = [
    { id: 1, tabName: "Student", type: ACCOUNT_TYPE.STUDENT },
    { id: 2, tabName: "Instructor", type: ACCOUNT_TYPE.INSTRUCTOR },
  ]

  return (
    <div>
      {/* Tab */}
      <div className="flex rounded-xl bg-slate-100 dark:bg-slate-700 p-1 gap-1 mb-6">
        {tabData.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setAccountType(tab.type)}
            className={`flex-1 rounded-lg py-2 px-4 text-sm font-medium transition-all duration-200 ${
              accountType === tab.type
                ? "bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
            }`}
          >
            {tab.tabName}
          </button>
        ))}
      </div>

      <form onSubmit={handleOnSubmit} className="flex flex-col gap-y-4">
        <div className="flex gap-x-4">
          <div className="flex-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">First Name</label>
            <input required type="text" name="firstName" value={firstName} onChange={handleOnChange} placeholder="First Name" className="form-style" />
          </div>
          <div className="flex-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</label>
            <input required type="text" name="lastName" value={lastName} onChange={handleOnChange} placeholder="Last Name" className="form-style" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
          <input required type="email" name="email" value={email} onChange={handleOnChange} placeholder="Enter email" className="form-style" />
        </div>

        <div className="flex gap-x-4">
          <div className="flex-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
            <div className="relative">
              <input required type={showPassword ? "text" : "password"} name="password" value={password} onChange={handleOnChange} placeholder="Password" className="form-style pr-10" />
              <span onClick={() => setShowPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400">
                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </span>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Confirm Password</label>
            <div className="relative">
              <input required type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={confirmPassword} onChange={handleOnChange} placeholder="Confirm" className="form-style pr-10" />
              <span onClick={() => setShowConfirmPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400">
                {showConfirmPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </span>
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          className="mt-4 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25"
        >
          Create Account
        </motion.button>
      </form>
    </div>
  )
}

export default SignupForm
