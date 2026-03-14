import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  // إذا لم يوجد توكن → رجوع لصفحة دخول الأدمن
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // إذا كان المستخدم ليس أدمن → رجوع للصفحة الرئيسية
  if (userRole !== "admin") {
    return <Navigate to="/" replace />;
  }

  // إذا كان أدمن → يسمح بالدخول
  return <Outlet />;
};

export default ProtectedRoute;