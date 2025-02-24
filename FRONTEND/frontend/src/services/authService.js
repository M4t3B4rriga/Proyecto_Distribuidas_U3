const API_URL = "https://tu-api.com";

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Error en login");
    
    localStorage.setItem("token", data.token);
    return data;
  } catch (error) {
    throw error;
  }
};

export const loginWithGoogle = () => {
  window.location.href = `${API_URL}/auth/google`;
};
