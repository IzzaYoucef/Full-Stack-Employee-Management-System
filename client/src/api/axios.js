
import axios from "axios";

const api = axios.create({
  baseURL: (import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:4000") + "/api"
});

// Attach the authentication token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// If the token is missing/expired/invalid, clear it and go back to the login page
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isLogin = err.config?.url?.includes("/auth/login");
    if (err.response?.status === 401 && !isLogin) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
