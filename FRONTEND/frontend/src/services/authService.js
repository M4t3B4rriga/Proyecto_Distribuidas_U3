import axios from 'axios';


const API_URL = "http://localhost:8080/auth";


export const authService = {
  // Login
  async login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password }
        ,{headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }}
      );

      this.logout();
      
      // Save token to localStorage
      localStorage.setItem("token", response.data.token);
      
      return response.data;
    } catch (error) {
      // More detailed error logging
      console.error("Login error details:", {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        message: error.message,
        config: error.config
      });



      // More specific error handling
      if (error.response) {
        if (error.response.status === 401) {
          throw new Error("Credenciales inválidas. Por favor, verifica tu correo y contraseña.");
        } else if (error.response.status === 403) {
          throw new Error("Acceso denegado. No tienes permiso para iniciar sesión.");
        } else {
          throw new Error(`Error de inicio de sesión: ${error.response.status}`);
        }
      } else if (error.request) {
        throw new Error("No se pudo conectar con el servidor. Por favor, verifica tu conexión.");
      } else {
        throw new Error("Ocurrió un error inesperado. Inténtalo de nuevo.");
      }
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
  async validateToken() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const response=await axios.post(`${API_URL}/token/validate`,{token},
      {
        headers:{
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
      );
      return response.status===200;
    } catch (error) {
      // Token is invalid or expired
      console.error("Error validando token:", error.response?.data || error.message);
      this.logout();
      return false;
    }
  },
  // Logout
  logout() {
    localStorage.removeItem("token");
  },

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getItem("token");
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
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);