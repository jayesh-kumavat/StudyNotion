import { apiConnector } from "../apiconnector"
import { gamificationEndpoints } from "../apis"
import { toast } from "react-hot-toast"

const {
  GET_GAMIFICATION_PROFILE_API,
  GET_LEADERBOARD_API,
} = gamificationEndpoints

export const getGamificationProfile = async (token) => {
  let result = null
  try {
    const response = await apiConnector(
      "GET",
      GET_GAMIFICATION_PROFILE_API,
      null,
      { Authorization: `Bearer ${token}` }
    )
    if (response?.data?.success) {
      result = response.data.data
    }
  } catch (error) {
    console.log("GET_GAMIFICATION_PROFILE ERROR............", error)
  }
  return result
}

export const getLeaderboard = async () => {
  let result = []
  try {
    const response = await apiConnector("GET", GET_LEADERBOARD_API)
    if (response?.data?.success) {
      result = response.data.data
    }
  } catch (error) {
    console.log("GET_LEADERBOARD ERROR............", error)
    toast.error("Could not load leaderboard")
  }
  return result
}
