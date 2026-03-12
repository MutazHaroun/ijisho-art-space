import axios from "axios";

const api = axios.create({
  // الرابط الأساسي للسيرفر
  baseURL: "http://localhost:5000/api",
});

// "Interceptor" لإضافة التوكن تلقائياً لكل طلب يخرج من التطبيق
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  
  if (token) {
    // إضافة التوكن في الـ Headers بصيغة Bearer Token
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
