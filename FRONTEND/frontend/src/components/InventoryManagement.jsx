import React, { useState, useEffect } from 'react';
import { inventoryService } from '../services/InventoryService';
import { storeService } from '../services/StoreService';
import { userService } from '../services/UserService';

const InventoryManagement = () => {
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedStore, setSelectedStore] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [quantity, setQuantity] = useState('');
  const [movementType, setMovementType] = useState('ENTRY');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const storesData = await storeService.getAllStores();
      setStores(storesData);

      // TODO: Replace with actual product service when implemented
      // const productsData = await productService.getAllProducts();
      // setProducts(productsData);

      const usersData = await userService.getAllUsers();
      setUsers(usersData);
    } catch (error) {
      setError('No se pudieron cargar los datos iniciales');
    }
  };

  const handleStockUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedStore || !selectedProduct || !selectedUser || !quantity) {
      setError('Por favor, complete todos los campos');
      return;
    }

    try {
      await inventoryService.updateStock(
        selectedStore, 
        selectedProduct, 
        parseInt(quantity), 
        selectedUser, 
        movementType
      );

      setSuccess('Movimiento de inventario registrado exitosamente');
      
      // Reset form
      setSelectedProduct('');
      setQuantity('');
    } catch (error) {
      setError(error.response?.data?.message || 'Error al actualizar el inventario');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Gestión de Inventario</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleStockUpdate} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Tienda</label>
          <select
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Seleccionar Tienda</option>
            {stores.map(store => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Producto</label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            disabled={!selectedStore}
          >
            <option value="">Seleccionar Producto</option>
            {/* TODO: Implement product list dynamically */}
            <option value="1">Producto de Ejemplo 1</option>
            <option value="2">Producto de Ejemplo 2</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Usuario</label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Seleccionar Usuario</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Tipo de Movimiento</label>
          <select
            value={movementType}
            onChange={(e) => setMovementType(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="ENTRY">Entrada</option>
            <option value="EXIT">Salida</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Cantidad</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            min="1"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Registrar Movimiento
          </button>
        </div>
      </form>
    </div>
  );
};

export default InventoryManagement;