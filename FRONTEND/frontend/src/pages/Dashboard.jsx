import React, { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { storeService } from "../services/storeService";
import { productService } from "../services/productService";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStores();
    fetchProducts();
  }, []);

  const fetchStores = async () => {
    try {
      const data = await storeService.getAllStores();
      setStores(data);
    } catch (error) {
      setError("No se pudieron cargar las tiendas.");
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (error) {
      setError("No se pudieron cargar los productos.");
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard de Usuario</h1>
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Cerrar Sesión
          </button>
        </div>

        {error && (
          <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </p>
        )}

        {/* Section: Stores */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Lista de Tiendas</h2>
          <table className="w-full border-collapse bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="border p-2">ID</th>
                <th className="border p-2">Nombre</th>
                <th className="border p-2">Dirección</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store) => (
                <tr key={store.id} className="border-b hover:bg-gray-100 transition">
                  <td className="border p-2">{store.id}</td>
                  <td className="border p-2">{store.name}</td>
                  <td className="border p-2">{store.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section: Products */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Lista de Productos</h2>
          <table className="w-full border-collapse bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="border p-2">ID</th>
                <th className="border p-2">Nombre</th>
                <th className="border p-2">Precio</th>
                <th className="border p-2">Categoría</th>
                <th className="border p-2">Tienda</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-100 transition">
                  <td className="border p-2">{p.id}</td>
                  <td className="border p-2">{p.name}</td>
                  <td className="border p-2">${p.price}</td>
                  <td className="border p-2">{p.category}</td>
                  <td className="border p-2">{p.storeName || "Sin tienda"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;