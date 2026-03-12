import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  // إذا لم يجد التوكن، يعيده لصفحة الدخول
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // إذا وجد التوكن، يفتح له المسارات الداخلية
  return <Outlet />;
};

export default ProtectedRoute;