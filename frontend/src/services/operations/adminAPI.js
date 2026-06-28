import { toast } from "react-hot-toast"
import { apiConnector } from "../apiconnector"
import { adminEndpoints } from "../apis"

const {
  GET_PLATFORM_STATS_API,
  GET_ALL_USERS_API,
  TOGGLE_USER_STATUS_API,
  TOGGLE_INSTRUCTOR_APPROVAL_API,
  GET_ALL_COURSES_ADMIN_API,
  TOGGLE_COURSE_STATUS_API,
  GET_ALL_TRANSACTIONS_API,
  DELETE_USER_API,
} = adminEndpoints


export const getPlatformStats = async (token) => {
  let result = null
  try {
    const response = await apiConnector("GET", GET_PLATFORM_STATS_API, null, {
      Authorization: `Bearer ${token}`,
    })
    console.log("PLATFORM STATS RESPONSE....", response)
    if (response?.data?.success) {
      result = response.data.data
    }
  } catch (error) {
    console.log("GET_PLATFORM_STATS ERROR............", error)
  }
  return result
}


export const getAllUsers = async (token, page = 1, search = "", accountType = "") => {
  let result = null
  try {
    const url = `${GET_ALL_USERS_API}?page=${page}&search=${search}&accountType=${accountType}`
    const response = await apiConnector("GET", url, null, {
      Authorization: `Bearer ${token}`,
    })
    if (response?.data?.success) {
      result = response.data.data
    }
  } catch (error) {
    console.log("GET_ALL_USERS ERROR............", error)
  }
  return result
}

export const toggleUserStatus = async (userId, token) => {
  const toastId = toast.loading("Updating...")
  let result = null
  try {
    const response = await apiConnector(
      "POST",
      TOGGLE_USER_STATUS_API,
      { userId },
      { Authorization: `Bearer ${token}` }
    )
    if (response?.data?.success) {
      toast.success(response.data.message)
      result = response.data.data
    }
  } catch (error) {
    console.log("TOGGLE_USER_STATUS ERROR............", error)
    toast.error("Failed to update user status")
  }
  toast.dismiss(toastId)
  return result
}

export const toggleInstructorApproval = async (userId, token) => {
  const toastId = toast.loading("Updating...")
  let result = null
  try {
    const response = await apiConnector(
      "POST",
      TOGGLE_INSTRUCTOR_APPROVAL_API,
      { userId },
      { Authorization: `Bearer ${token}` }
    )
    console.log("TOGGLE APPROVAL RESPONSE....", response)
    if (response?.data?.success) {
      toast.success(response.data.message)
      result = response.data.data
    }
  } catch (error) {
    console.log("TOGGLE_INSTRUCTOR_APPROVAL ERROR............", error)
    toast.error("Failed to update approval")
  }
  toast.dismiss(toastId)
  return result
}


export const getAllCoursesAdmin = async (token, status = "") => {
  let result = []
  try {
    const url = status
      ? `${GET_ALL_COURSES_ADMIN_API}?status=${status}`
      : GET_ALL_COURSES_ADMIN_API
    const response = await apiConnector("GET", url, null, {
      Authorization: `Bearer ${token}`,
    })
    if (response?.data?.success) {
      result = response.data.data
    }
  } catch (error) {
    console.log("GET_ALL_COURSES_ADMIN ERROR............", error)
  }
  return result
}

export const toggleCourseStatus = async (courseId, status, token) => {
  const toastId = toast.loading("Updating...")
  let result = null
  try {
    const response = await apiConnector(
      "POST",
      TOGGLE_COURSE_STATUS_API,
      { courseId, status },
      { Authorization: `Bearer ${token}` }
    )
    if (response?.data?.success) {
      toast.success(response.data.message)
      result = response.data.data
    }
  } catch (error) {
    console.log("TOGGLE_COURSE_STATUS ERROR............", error)
    toast.error("Failed to update course status")
  }
  toast.dismiss(toastId)
  return result
}

export const getAllTransactions = async (token) => {
  let result = null
  try {
    const response = await apiConnector("GET", GET_ALL_TRANSACTIONS_API, null, {
      Authorization: `Bearer ${token}`,
    })
    // console.log("TRANSACTIONS RESPONSE....", response)
    if (response?.data?.success) {
      result = response.data.data
    }
  } catch (error) {
    console.log("GET_ALL_TRANSACTIONS ERROR............", error)
  }
  return result
}


export const deleteUser = async (userId, token) => {
  const toastId = toast.loading("Deleting user...")
  try {
    const response = await apiConnector(
      "POST",
      DELETE_USER_API,
      { userId },
      { Authorization: `Bearer ${token}` }
    )
    if (response?.data?.success) {
      toast.success("User deleted")
      toast.dismiss(toastId)
      return true
    }
  } catch (error) {
    console.log("DELETE_USER ERROR............", error)
    toast.error("Failed to delete user")
  }
  toast.dismiss(toastId)
  return false
}
