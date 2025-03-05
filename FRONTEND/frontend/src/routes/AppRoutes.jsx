import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import React, {useEffect, useState}from 'react';
import Login from "../pages/Login";
import MainLayout from "../layouts/MainLayout";
import AdminDashboard from "../pages/AdminDashboard";
import { authService } from "../services/authService";
import Dashboard from "../pages/Dashboard";

// Helper function to decode JWT token
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  } catch (error) {
    console.error('Token decoding error:', error);
    return {};
  }
};



const ProtectedRoute = ({ children, adminOnly = false }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const checkToken = async () => {
      const token = authService.getToken();
      if (!token) {
        navigate('/');
        return;
      }
      try {
        const tokenValid = await authService.validateToken();
        if (!tokenValid) {
          authService.logout();
          navigate('/');
          return;
        }

        // Decode token to check user role
        const decodedToken = decodeToken(token);
        
        // If admin-only route, check user role
        if (adminOnly && (!decodedToken || decodedToken.role !== 'ADMIN')) {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Token validation error:', error);
        authService.logout();
        navigate('/');
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

const AppRoutes = () => {
  authService.logout=function(){
    localStorage.removeItem("token"); // Borra el token
    sessionStorage.clear();
    caches.keys().then((names) => names.forEach((name) => caches.delete(name))); 
    window.location.href = "/login"; // Redirige al login
  };

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, "", window.location.href);
    };
  }, []);
  
  return (
    <Router>
      <Routes>
        {/* Public Routes*/ }
        <Route path="/" element={<Login />} />
        
        {/* Protected Routes*/ }
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin-Only Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch-all route redirects to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
