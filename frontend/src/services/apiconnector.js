import axios from "axios"

export const axiosInstance = axios.create({
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Skip logout for refresh-token calls (handled separately)
            const requestUrl = error.config?.url || ""
            if (requestUrl.includes("refresh-token")) {
                return Promise.reject(error)
            }

            // Only force logout if token exists but is invalid (truly expired)
            const token = localStorage.getItem("token")
            if (token) {
                localStorage.removeItem("token")
                localStorage.removeItem("user")
                const path = window.location.pathname
                if (path !== "/" && path !== "/login" && path !== "/signup") {
                    window.location.href = "/"
                }
            }
        }
        return Promise.reject(error)
    }
)

export const apiConnector = (method, url, bodyData, headers, params) => {
    return axiosInstance({
        method:`${method}`,
        url:`${url}`,
        data: bodyData ? bodyData : null,
        headers: headers ? headers: null,
        params: params ? params : null,
    });
}
