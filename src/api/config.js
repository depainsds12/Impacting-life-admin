import axios from "axios"

export const getBaseURL = () => {
  return import.meta.env.VITE_API_URL
}
export const getBaseeditorkey = () => {
  return import.meta.env.REACT_APP_EDITOR_ID
}

export const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  // timeout: 10000,s
  headers: {
    "Content-Type": "application/json",
  },
})

axiosInstance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    if (response.data && response?.data?.message == "Unauthorized!") {
      alert("Token Expired")
      localStorage.clear()
      window.location.href = "/login"
    } else return response
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    return Promise.reject(error)
  },
)

export const getAxios = () => {
  return axiosInstance
}

export const getHeaders = () => {
  let token = localStorage.getItem("authToken") ?? ""
  return {
    token: token,
  }
}

export const baseImageUrl = "data:image/png;base64,"
