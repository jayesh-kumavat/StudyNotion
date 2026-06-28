import { apiConnector } from "../apiconnector"
import { learningPathEndpoints } from "../apis"
import { toast } from "react-hot-toast"

const {
  GENERATE_PATH_API,
  GET_MY_PATHS_API,
  DELETE_PATH_API,
} = learningPathEndpoints

export const generateLearningPath = async (data, token) => {
  const toastId = toast.loading("Generating your learning path...")
  let result = null
  try {
    const response = await apiConnector("POST", GENERATE_PATH_API, data, {
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not generate path")
    }
    toast.success("Learning path created!")
    result = response.data.data
  } catch (error) {
    console.log("GENERATE_PATH_API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

export const getUserLearningPaths = async (token) => {
  let result = []
  try {
    const response = await apiConnector("GET", GET_MY_PATHS_API, null, {
      Authorization: `Bearer ${token}`,
    })
    if (response?.data?.success) {
      result = response.data.data
    }
  } catch (error) {
    console.log("GET_MY_PATHS ERROR............", error)
  }
  return result
}

export const deleteLearningPath = async (pathId, token) => {
  const toastId = toast.loading("Removing...")
  try {
    const response = await apiConnector(
      "POST",
      DELETE_PATH_API,
      { pathId },
      { Authorization: `Bearer ${token}` }
    )
    if (response?.data?.success) {
      toast.success("Learning path removed")
    }
  } catch (error) {
    console.log("DELETE_PATH ERROR............", error)
    toast.error("Could not remove learning path")
  }
  toast.dismiss(toastId)
}
