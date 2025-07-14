import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {},
});

axiosInstance.interceptors.request.use(
  (config) => {
    let token = Cookies.get("token") || "";
    const userToken = token ? JSON.parse(token) : null;
    if (typeof userToken === "string" && config.headers && userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error?.response?.status == 401) {
      Cookies.remove("token");
      if (!window.location.pathname.includes("/login"))
        window.location.replace("/login");
    }
    if (error?.response?.status == 417) {
      if (!window.location.pathname.includes("/session-expired"))
        window.location.replace("/session-expired");
      return new Promise(() => {});
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;
