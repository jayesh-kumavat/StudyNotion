import { resetCart } from "../../slices/cartSlice"
import { setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiconnector"
import { endpoints } from "../apis"
import { setLoading, setToken } from "../../slices/authSlice"
import { toast } from "react-hot-toast"

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  LOGOUT_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints

export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      })
      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.dismiss(toastId)
      toast.success("OTP Sent Successfully")
      navigate("/verify-email")
    } catch (error) {
      console.log("SENDOTP API ERROR:", error)
      toast.dismiss(toastId)
      toast.error("Could Not Send OTP")
    }
    dispatch(setLoading(false))
  }
}

export function signUp(
  accountType, firstName, lastName, email, password, confirmPassword, otp, navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType, firstName, lastName, email, password, confirmPassword, otp,
      })
      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.dismiss(toastId)
      toast.success("Signup Successful")
      navigate("/login")
    } catch (error) {
      console.log("SIGNUP API ERROR:", error)
      toast.dismiss(toastId)
      toast.error("Signup Failed")
      navigate("/signup")
    }
    dispatch(setLoading(false))
  }
}


export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", LOGIN_API, { email, password })
      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      dispatch(setToken(response.data.token))
      const userImage = response.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName}-${response.data.user.lastName}`
      dispatch(setUser({ ...response.data.user, image: userImage }))
      localStorage.setItem("token", JSON.stringify(response.data.token))
      localStorage.setItem("user", JSON.stringify(response.data.user))
      toast.dismiss(toastId)
      toast.success("Login Successful")
      navigate("/dashboard/my-profile")
    } catch (error) {
      console.log("LOGIN API ERROR:", error)
      toast.dismiss(toastId)
      toast.error("Login Failed")
    }
    dispatch(setLoading(false))
  }
}

export function logout(navigate, silent = false) {
  return async (dispatch) => {
    try {
      await apiConnector("POST", LOGOUT_API)
    } catch (error) {
      console.log("LOGOUT API ERROR:", error)
    }
    dispatch(setToken(null))
    dispatch(setUser(null))
    dispatch(resetCart())
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    if (!silent) toast.success("Logged Out")
    navigate("/")
  }
}

export function getPasswordResetToken(email, setEmailSent) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", RESETPASSTOKEN_API, { email })
      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.dismiss(toastId)
      toast.success("Reset Email Sent")
      setEmailSent(true)
    } catch (error) {
      console.log("RESET PASSWORD TOKEN Error:", error)
      toast.dismiss(toastId)
      toast.error("Failed to send email for resetting password")
    }
    dispatch(setLoading(false))
  }
}

export function resetPassword(password, confirmPassword, token) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", RESETPASSWORD_API, { password, confirmPassword, token })
      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.dismiss(toastId)
      toast.success("Password has been reset successfully")
    } catch (error) {
      console.log("RESET PASSWORD Error:", error)
      toast.dismiss(toastId)
      toast.error("Unable to reset password")
    }
    dispatch(setLoading(false))
  }
}
