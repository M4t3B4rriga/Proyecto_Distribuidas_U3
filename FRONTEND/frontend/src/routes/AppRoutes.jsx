import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react"; // ✅ Ensure React is imported
import Login from "../pages/Login";
import MainLayout from "../layouts/MainLayout";
import AdminDashboard from "../pages/AdminDashboard";
import Dashboard from "../pages/Dashboard";
import ProductManagement from "../components/ProductManagement";
import { authService } from "../services/authService";

// Helper function to decode JWT token
const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    return JSON.parse(window.atob(base64));
  } catch (error) {
    console.error("Token decoding error:", error);
    return {};
  }
};

// Protected Route
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = authService.getToken();
      if (!token) {
        navigate("/");
        return;
      }
      try {
        const tokenValid = await authService.validateToken();
        if (!tokenValid) {
          authService.logout();
          navigate("/");
          return;
        }
        const decodedToken = decodeToken(token);
        if (adminOnly && (!decodedToken || decodedToken.role !== "ADMIN")) {
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Token validation error:", error);
        authService.logout();
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, [navigate, adminOnly]);

  if (isLoading) {
    return <div>Loading....</div>;
  }

  return children;
};

// Routes
const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute><ProductManagement /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;