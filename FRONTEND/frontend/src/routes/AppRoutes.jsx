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

  const [isAuthenticated, setAuthenticated]=useState(false);


 edbf17e36479b5c4430368fa42ef02e2bb54bcb0
  useEffect(() => {
    const checkToken = async () => {
      const token = authService.getToken();
      console.log("Token obtenido en ProtectedRoute:", token);
      if (!token) {
HEAD
        console.log("No hay token, redirigiendo al login...");
        navigate('/');

        navigate("/");
 edbf17e36479b5c4430368fa42ef02e2bb54bcb0
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
 HEAD
        console.log("Token decodificado:", decodedToken);
        
        // If admin-only route, check user role
        if (adminOnly && (!decodedToken || decodedToken.role !== 'ADMIN')) {
          navigate('/dashboard');
          return;

        if (adminOnly && (!decodedToken || decodedToken.role !== "ADMIN")) {
          navigate("/dashboard");
 edbf17e36479b5c4430368fa42ef02e2bb54bcb0
        }
        setAuthenticated(true);
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

  return isAuthenticated ? children : null;
};

// Routes
const AppRoutes = () => {
 HEAD
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, "", window.location.href);
    };
  }, []);
  

 edbf17e36479b5c4430368fa42ef02e2bb54bcb0
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