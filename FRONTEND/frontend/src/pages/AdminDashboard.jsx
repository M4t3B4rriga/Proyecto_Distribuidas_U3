import React, { useState } from 'react';
import StoreManagement from '../components/StoreManagement.jsx';
import UserManagement from '../components/UserManagement';
import ProductManagement from '../components/ProductManagement.jsx';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stores');
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
      
      <div className="flex mb-4">
        <button 
          className={`px-4 py-2 mr-2 ${activeTab === 'stores' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('stores')}
        >
          Gestión de Tiendas
        </button>
        <button 
          className={`px-4 py-2 mr-2${activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('users')}
        >
          Gestión de Usuarios
        </button>
        <button 
          className={`px-4 py-2 mr-2${activeTab === 'products' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('products')}
        >
          Gestión de Productos
        </button>

        <button 
          onClick={handleLogout} 
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Cerrar Sesión
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        {activeTab === 'stores' && <StoreManagement />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'products' && <ProductManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;