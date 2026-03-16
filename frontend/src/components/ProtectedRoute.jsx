import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import api from "../api/axios";

const ProtectedRoute = () => {
  const [status, setStatus] = useState({ loading: true, allowed: false });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/admin/profile");
        setStatus({ loading: false, allowed: res.data?.role === "admin" });
      } catch {
        setStatus({ loading: false, allowed: false });
      }
    };

    checkAuth();
  }, []);

  if (status.loading) {
    return null; // or a spinner
  }

  if (!status.allowed) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;