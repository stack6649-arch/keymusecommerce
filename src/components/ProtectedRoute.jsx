import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("authToken") || localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("currentUser") || "null");
  const isAuthenticated = !!(token && user?.username);

  return isAuthenticated ? children : <Navigate to="/login" state={{ from: location }} replace />;
}
