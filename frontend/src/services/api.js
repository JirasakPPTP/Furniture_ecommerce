import axios from "axios";
import { API_URL } from "./config";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const onAuthPages = ["/login", "/register"].includes(window.location.pathname);
      if (!onAuthPages) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
