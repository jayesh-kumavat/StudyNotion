import { apiConnector } from "../apiconnector"
import { discussionEndpoints } from "../apis"
import { toast } from "react-hot-toast"

const {
  CREATE_DISCUSSION_API,
  GET_COURSE_DISCUSSIONS_API,
  ADD_REPLY_API,
  TOGGLE_LIKE_API,
  DELETE_DISCUSSION_API,
} = discussionEndpoints

export const createDiscussion = async (data, token) => {
  const toastId = toast.loading("Posting...")
  let result = null
  try {
    const response = await apiConnector("POST", CREATE_DISCUSSION_API, data, {
      Authorization: `Bearer ${token}`,
    })

    console.log("CREATE DISCUSSION RESPONSE....", response)

    if (!response?.data?.success) {
      throw new Error("Could not create discussion")
    }
    toast.success("Discussion posted!")
    result = response.data.data
  } catch (error) {
    console.log("CREATE_DISCUSSION ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

export const getCourseDiscussions = async (courseId, token) => {
  let result = []
  try {
    const response = await apiConnector(
      "POST",
      GET_COURSE_DISCUSSIONS_API,
      { courseId },
      { Authorization: `Bearer ${token}` }
    )
    if (response?.data?.success) {
      result = response.data.data
    }
  } catch (error) {
    console.log("GET_COURSE_DISCUSSIONS ERROR............", error)
  }
  return result
}

export const addReply = async (data, token) => {
  let result = null
  try {
    const response = await apiConnector("POST", ADD_REPLY_API, data, {
      Authorization: `Bearer ${token}`,
    })
    // console.log("ADD REPLY RESPONSE....", response)
    if (response?.data?.success) {
      toast.success("Reply posted!")
      result = response.data.data
    }
  } catch (error) {
    console.log("ADD_REPLY ERROR............", error)
    toast.error("Could not post reply")
  }
  return result
}

export const toggleLikeDiscussion = async (discussionId, token) => {
  let result = null
  try {
    const response = await apiConnector(
      "POST",
      TOGGLE_LIKE_API,
      { discussionId },
      { Authorization: `Bearer ${token}` }
    )
    if (response?.data?.success) {
      result = response.data.data
    }
  } catch (error) {
    console.log("TOGGLE_LIKE ERROR............", error)
  }
  return result
}

export const deleteDiscussion = async (discussionId, token) => {
  try {
    const response = await apiConnector(
      "POST",
      DELETE_DISCUSSION_API,
      { discussionId },
      { Authorization: `Bearer ${token}` }
    )
    if (response?.data?.success) {
      toast.success("Discussion deleted")
      return true
    }
  } catch (error) {
    console.log("DELETE_DISCUSSION ERROR............", error)
    toast.error("Could not delete")
  }
  return false
}
