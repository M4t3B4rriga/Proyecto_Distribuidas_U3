import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { authService } from "../services/authService";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "EMPLOYEE"
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar errores previos

    if (!formData.email || !formData.password) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      if (isLogin) {
        const response = await authService.login(formData.email, formData.password);
        console.log("Usuario autenticado:", response);

        // Decode token to check role
        const token = response.token;
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        const decodedToken = JSON.parse(window.atob(base64));

        // Route based on role
        if (decodedToken.role === 'ADMIN') {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        const registrationData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phoneNumber,
          role: formData.role
        };

        const result = await authService.register(registrationData);
        console.log("Usuario registrado:", result);
        
        // Show success message and switch to login
        setIsLogin(true);
        setError("Registro exitoso. Por favor, inicia sesión.");
      } 
    
  }
  catch (err) {
    console.error("Full error object:", err);
    setError(err.message || "Ocurrió un error al intentar iniciar sesión.");
    }
  };

const toggleAuthModel=()=>{
  setIsLogin(!isLogin);
  setError("");
  setFormData({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "EMPLOYEE"
  });
}

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 text-center">{isLogin ? "Iniciar Sesión" : "Registrarse"}</h2>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-4">
          {!isLogin && (
            <>
          <div className="mb-4">
            <label className="block text-gray-700">Nombre</label>
            <input
              type="text"
              name="firstName"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
              value={formData.firstName}
              onChange={handleChange}
              required={!isLogin}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Apellido</label>
            <input
              type="text"
              name="lastName"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
              value={formData.lastName}
              onChange={handleChange}
              required={!isLogin}
            />
          </div>
          <div className="mb-4">
                <label className="block text-gray-700">Número de Teléfono</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>

          </>
          )}

          <div className="mb-4">
            <label className="block text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Contraseña</label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
            />
          </div>


          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {isLogin ? "Iniciar Sesión" : "Registrarse"}

          </button>
        </form>

        <div className="mt-4 text-center">
          <button
          type="button"
          onClick={toggleAuthModel}
          className="text-blue-600 hover:underline"
            //
          >
            {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
        </div>

          <div className="mt-4 text-center">
          <button
            className="flex items-center justify-center w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
            type="button"
            >
            <FaGoogle className="mr-2" /> Iniciar con Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
