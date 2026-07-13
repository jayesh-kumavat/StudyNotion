import axios from "axios"

export const axiosInstance = axios.create({
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            const requestUrl = error.config?.url || ""
            
            // Skip logout for refresh-token calls (handled separately)
            if (requestUrl.includes("refresh-token")) {
                return Promise.reject(error)
            }

            // Only force logout if token is truly invalid (not network/timeout issues)
            const token = localStorage.getItem("token")
            const message = error.response?.data?.message || ""
            if (token && (message.includes("token is invalid") || message.includes("Token Missing"))) {
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
