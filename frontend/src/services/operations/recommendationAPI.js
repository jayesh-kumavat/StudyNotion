import { apiConnector } from "../apiconnector"
import { recommendationEndpoints } from "../apis"

const {
  GET_RECOMMENDATIONS_API,
  GET_TRENDING_API,
} = recommendationEndpoints

export const getPersonalizedRecommendations = async (token) => {
  let result = []
  try {
    const response = await apiConnector("GET", GET_RECOMMENDATIONS_API, null, {
      Authorization: `Bearer ${token}`,
    })
    if (response?.data?.success) {
      result = response.data.data
    }
  } catch (error) {
    console.log("GET_RECOMMENDATIONS ERROR............", error)
  }
  return result
}


export const getTrendingCourses = async () => {
  let result = []
  try {
    const response = await apiConnector("GET", GET_TRENDING_API)
    if (response?.data?.success) {
      result = response.data.data
    }
  } catch (error) {
    console.log("GET_TRENDING ERROR............", error)
  }
  return result
}
