import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  
  // Check for token and user in localStorage
  const token = localStorage.getItem("authToken") || localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const isAuthenticated = !!(token && currentUser?.username);

  // If user is authenticated, show the page
  if (isAuthenticated) {
    return children;
  }

  // If not authenticated, redirect to login with the original location
  return <Navigate to="/login" state={{ from: location }} replace />;
}
