import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
  withCredentials: true,
});


// إضافة التوكن تلقائياً لكل request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// التعامل مع الأخطاء القادمة من السيرفر
api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response) {

      // إذا انتهت صلاحية التوكن
      if (error.response.status === 401) {

        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userName");
        localStorage.removeItem("adminUser");

        // إعادة التوجيه لصفحة تسجيل الدخول
        window.location.href = "/admin/login";
      }

      if (error.response.status === 403) {
        console.warn("Access forbidden");
      }

      if (error.response.status === 500) {
        console.error("Server error");
      }

    } else {
      console.error("Network error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
