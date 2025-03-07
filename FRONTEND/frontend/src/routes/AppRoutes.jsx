import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Login from "../pages/Login";
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

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = authService.getToken();
      if (!token) {
        console.log("No token found, redirecting to login...");
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
        console.log("Decoded Token:", decodedToken);
        
        setRole(decodedToken.role);
        setAuthenticated(true);

        // Role-Based Redirect Logic
        if (decodedToken.role === "ADMIN") {
          navigate("/admin");
        } else if (decodedToken.role === "EMPLOYEE") {
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
  }, [navigate]);

  if (isLoading) {
    return <div>Loading....</div>;
  }

  return isAuthenticated ? children : null;
};

// Routes
const AppRoutes = () => {
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, "", window.location.href);
    };
  }, []);

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