import axios from 'axios';


const API_URL = "http://localhost:8080/auth";


export const authService = {
  // Login
  async login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password }
        ,{headers: {
          'Content-Type': 'application/json'
        }}
      );
      
      // Save token to localStorage
      localStorage.setItem("token", response.data.token);
      
      return response.data;
    } catch (error) {
      // Handle login errors
      console.error("Login error:", error.response ? error.response.data : error.message);
      throw new Error(
        error.response?.data?.message ||
        error.response?.data ||
        "Login failed");
      }
  },

  // Register
  async register(userData) {
    try {
      const response = await axios.post(`${API_URL}/register`, userData,
        {headers: {
          'Content-Type': 'application/json'
        }}
       
      );
      return response.data;
    } catch (error) {
       // Handle registration errors
       console.error("Registration error:", error.response ? error.response.data : error.message);
      
       // Handle validation errors
       if (error.response?.data && typeof error.response.data === 'object') {
         const errorMessages = Object.values(error.response.data).join(', ');
         throw new Error(errorMessages || "Registration failed");
       }
       
       throw new Error(
         error.response?.data?.error || 
         error.response?.data || 
         "Registration failed"
       );
    }
  },

  // Validate Token
  async validateToken(token) {
    try {
      const response = await axios.post(`${API_URL}/token/validate`, { token });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        "Token validation failed"
      );
    }
  },

  // Logout
  logout() {
    localStorage.removeItem("token");
  },

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem("token");
    return !!token;
  },

  // Get token from localStorage
  getToken() {
    return localStorage.getItem("token");
  }
};

// Axios interceptor to add token to requests
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);