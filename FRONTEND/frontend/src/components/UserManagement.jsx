import React, { useState, useEffect } from 'react';
import { userService } from '../services/UserService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    password: '', 
    role: 'EMPLOYEE',
    phoneNumber: ''
  });
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
      setError(null);
    } catch (error) {
      setError('No se pudieron cargar los usuarios');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const createdUser = await userService.createUser(newUser);
      setUsers([...users, createdUser]);
      setNewUser({ 
        firstName: '', 
        lastName: '', 
        email: '', 
        password: '', 
        role: 'EMPLOYEE',
        phoneNumber: ''
      });
      setError(null);
    } catch (error) {
      setError('No se pudo crear el usuario');
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await userService.updateUser(editingUser.id, editingUser);
      setUsers(users.map(user => 
        user.id === editingUser.id ? updatedUser : user
      ));
      setEditingUser(null);
      setError(null);
    } catch (error) {
      setError('No se pudo actualizar el usuario');
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await userService.deleteUser(id);
      setUsers(users.filter(user => user.id !== id));
      setError(null);
    } catch (error) {
      setError('No se pudo eliminar el usuario');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Gestión de Usuarios</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      {/* User Creation/Editing Form */}
      <form 
        onSubmit={editingUser ? handleUpdateUser : handleCreateUser} 
        className="mb-6 grid grid-cols-3 gap-4"
      >
        <input 
          type="text" 
          placeholder="Nombre" 
          value={editingUser ? editingUser.firstName : newUser.firstName}
          onChange={(e) => 
            editingUser 
              ? setEditingUser({...editingUser, firstName: e.target.value}) 
              : setNewUser({...newUser, firstName: e.target.value})
          }
          className="border p-2 rounded"
          required 
        />
        <input 
          type="text" 
          placeholder="Apellido" 
          value={editingUser ? editingUser.lastName : newUser.lastName}
          onChange={(e) => 
            editingUser 
              ? setEditingUser({...editingUser, lastName: e.target.value}) 
              : setNewUser({...newUser, lastName: e.target.value})
          }
          className="border p-2 rounded"
          required 
        />
        <input 
          type="email" 
          placeholder="Correo Electrónico" 
          value={editingUser ? editingUser.email : newUser.email}
          onChange={(e) => 
            editingUser 
              ? setEditingUser({...editingUser, email: e.target.value}) 
              : setNewUser({...newUser, email: e.target.value})
          }
          className="border p-2 rounded"
          required 
        />
        {!editingUser && (
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={newUser.password}
            onChange={(e) => setNewUser({...newUser, password: e.target.value})}
            className="border p-2 rounded"
            required 
          />
        )}
        <select
          value={editingUser ? editingUser.role : newUser.role}
          onChange={(e) => 
            editingUser 
              ? setEditingUser({...editingUser, role: e.target.value}) 
              : setNewUser({...newUser, role: e.target.value})
          }
          className="border p-2 rounded"
        >
          <option value="EMPLOYEE">Empleado</option>
          <option value="ADMIN">Administrador</option>
        </select>
        <input 
          type="text" 
          placeholder="Número de Teléfono" 
          value={editingUser ? editingUser.phoneNumber : newUser.phoneNumber}
          onChange={(e) => 
            editingUser 
              ? setEditingUser({...editingUser, phoneNumber: e.target.value}) 
              : setNewUser({...newUser, phoneNumber: e.target.value})
          }
          className="border p-2 rounded"
        />
        <button 
          type="submit" 
          className="bg-blue-500 text-white p-2 rounded"
        >
          {editingUser ? 'Actualizar Usuario' : 'Crear Usuario'}
        </button>
      </form>

      {/* User List */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Apellido</th>
            <th className="border p-2">Correo</th>
            <th className="border p-2">Rol</th>
            <th className="border p-2">Teléfono</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="border p-2">{user.id}</td>
              <td className="border p-2">{user.firstName}</td>
              <td className="border p-2">{user.lastName}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{user.role}</td>
              <td className="border p-2">{user.phoneNumber}</td>
              <td className="border p-2 text-center">
                <button 
                  onClick={() => setEditingUser(user)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                >
                  Editar
                </button>
                <button 
                  onClick={() => handleDeleteUser(user.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;