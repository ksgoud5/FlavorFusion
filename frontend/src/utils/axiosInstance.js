// frontend/src/utils/axiosInstance.js
import axios from "axios";

// Create a pre-configured Axios instance so we never repeat the base URL
// in every single API call throughout the app.
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // e.g. http://localhost:5000/api
});

// Request interceptor — runs before EVERY request made with this instance.
// Automatically attaches the JWT token (if the user is logged in) to the
// Authorization header, so we never have to manually add it in every component.
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ff_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — runs after EVERY response.
// If the backend says our token is invalid/expired (401), automatically
// log the user out on the frontend so they're not stuck in a broken state.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("ff_token");
      localStorage.removeItem("ff_user");
      // We don't force-redirect here to keep this file simple;
      // AuthContext (below) handles reacting to logout state.
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;