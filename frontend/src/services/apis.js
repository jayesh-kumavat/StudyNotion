const BASE_URL = process.env.REACT_APP_BASE_URL

// AUTH ENDPOINTS
export const endpoints = {
  SENDOTP_API: BASE_URL + "/auth/sendotp",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  LOGOUT_API: BASE_URL + "/auth/logout",
  RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
  REFRESH_TOKEN_API: BASE_URL + "/auth/refresh-token",
}

// PROFILE ENDPOINTS
export const profileEndpoints = {
  GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
  GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profile/getEnrolledCourses",
  GET_INSTRUCTOR_DATA_API: BASE_URL + "/profile/instructorDashboard",
}

// STUDENTS ENDPOINTS
export const studentEndpoints = {
  COURSE_PAYMENT_API: BASE_URL + "/payment/capturePayment",
  COURSE_VERIFY_API: BASE_URL + "/payment/verifyPayment",
  SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/payment/sendPaymentSuccessEmail",
}

// COURSE ENDPOINTS
export const courseEndpoints = {
  GET_ALL_COURSE_API: BASE_URL + "/course/getAllCourses",
  COURSE_DETAILS_API: BASE_URL + "/course/getCourseDetails",
  EDIT_COURSE_API: BASE_URL + "/course/editCourse",
  COURSE_CATEGORIES_API: BASE_URL + "/course/showAllCategories",
  CREATE_COURSE_API: BASE_URL + "/course/createCourse",
  CREATE_SECTION_API: BASE_URL + "/course/addSection",
  CREATE_SUBSECTION_API: BASE_URL + "/course/addSubSection",
  UPDATE_SECTION_API: BASE_URL + "/course/updateSection",
  UPDATE_SUBSECTION_API: BASE_URL + "/course/updateSubSection",
  GET_ALL_INSTRUCTOR_COURSES_API: BASE_URL + "/course/getInstructorCourses",
  DELETE_SECTION_API: BASE_URL + "/course/deleteSection",
  DELETE_SUBSECTION_API: BASE_URL + "/course/deleteSubSection",
  DELETE_COURSE_API: BASE_URL + "/course/deleteCourse",
  GET_FULL_COURSE_DETAILS_AUTHENTICATED: BASE_URL + "/course/getFullCourseDetails",
  LECTURE_COMPLETION_API: BASE_URL + "/course/updateCourseProgress",
  CREATE_RATING_API: BASE_URL + "/course/createRating",
  SEARCH_COURSE_API: BASE_URL + "/course/searchCourse",
  SAVE_VIDEO_TIMESTAMP_API: BASE_URL + "/course/saveVideoTimestamp",
  GET_VIDEO_TIMESTAMP_API: BASE_URL + "/course/getVideoTimestamp",
}

// RATINGS AND REVIEWS
export const ratingsEndpoints = {
  REVIEWS_DETAILS_API: BASE_URL + "/course/getReviews",
}

// CATAGORIES API
export const categories = {
  CATEGORIES_API: BASE_URL + "/course/showAllCategories",
  CREATE_CATEGORY_API: BASE_URL + "/course/createCategory",
  DELETE_CATEGORY_API: BASE_URL + "/course/deleteCategory",
}

// CATALOG PAGE DATA
export const catalogData = {
  CATALOGPAGEDATA_API: BASE_URL + "/course/getCategoryPageDetails",
}
// CONTACT-US API
export const contactusEndpoint = {
  CONTACT_US_API: BASE_URL + "/contact/contact",
}

// SETTINGS PAGE API
export const settingsEndpoints = {
  UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updateDisplayPicture",
  UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
  CHANGE_PASSWORD_API: BASE_URL + "/auth/changepassword",
  DELETE_PROFILE_API: BASE_URL + "/profile/deleteProfile",
}

// gamification
export const gamificationEndpoints = {
  GET_GAMIFICATION_PROFILE_API: BASE_URL + "/gamification/profile",
  GET_LEADERBOARD_API: BASE_URL + "/gamification/leaderboard",
}

// learning paths
export const learningPathEndpoints = {
  GENERATE_PATH_API: BASE_URL + "/learning-path/generate",
  GET_MY_PATHS_API: BASE_URL + "/learning-path/my-paths",
  DELETE_PATH_API: BASE_URL + "/learning-path/delete",
}

// discussions
export const discussionEndpoints = {
  CREATE_DISCUSSION_API: BASE_URL + "/discussion/create",
  GET_COURSE_DISCUSSIONS_API: BASE_URL + "/discussion/course",
  ADD_REPLY_API: BASE_URL + "/discussion/reply",
  TOGGLE_LIKE_API: BASE_URL + "/discussion/like",
  DELETE_DISCUSSION_API: BASE_URL + "/discussion/delete",
}

// recommendations
export const recommendationEndpoints = {
  GET_RECOMMENDATIONS_API: BASE_URL + "/recommendation/personalized",
  GET_TRENDING_API: BASE_URL + "/recommendation/trending",
}

// admin
export const adminEndpoints = {
  GET_PLATFORM_STATS_API: BASE_URL + "/admin/stats",
  GET_ALL_USERS_API: BASE_URL + "/admin/users",
  TOGGLE_USER_STATUS_API: BASE_URL + "/admin/toggle-user-status",
  TOGGLE_INSTRUCTOR_APPROVAL_API: BASE_URL + "/admin/toggle-instructor-approval",
  GET_ALL_COURSES_ADMIN_API: BASE_URL + "/admin/courses",
  TOGGLE_COURSE_STATUS_API: BASE_URL + "/admin/toggle-course-status",
  GET_ALL_TRANSACTIONS_API: BASE_URL + "/admin/transactions",
  DELETE_USER_API: BASE_URL + "/admin/delete-user",
}

// features
export const featuresEndpoints = {
  CREATE_NOTE_API: BASE_URL + "/features/notes/create",
  GET_NOTES_API: BASE_URL + "/features/notes/get",
  UPDATE_NOTE_API: BASE_URL + "/features/notes/update",
  DELETE_NOTE_API: BASE_URL + "/features/notes/delete",
  TOGGLE_WISHLIST_API: BASE_URL + "/features/wishlist/toggle",
  GET_WISHLIST_API: BASE_URL + "/features/wishlist",
  ADD_RESOURCE_API: BASE_URL + "/features/resource/add",
  DELETE_RESOURCE_API: BASE_URL + "/features/resource/delete",
}

// lecture assistant
export const lectureAssistantEndpoints = {
  ASK_AI_API: BASE_URL + "/lecture-assistant/ask",
  GET_TRANSCRIPT_API: BASE_URL + "/lecture-assistant/transcript",
}
