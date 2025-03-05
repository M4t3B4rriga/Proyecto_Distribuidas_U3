import React, { useState } from 'react';
import StoreManagement from '../components/StoreManagement.jsx';
import UserManagement from '../components/UserManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stores');

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
          className={`px-4 py-2 ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('users')}
        >
          Gestión de Usuarios
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        {activeTab === 'stores' ? <StoreManagement /> : <UserManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;