import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "https://ijisho-art-space-1.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE,
});

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
