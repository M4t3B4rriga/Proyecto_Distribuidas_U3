import React, { useState, useEffect } from 'react';
import { storeService } from '../services/StoreService';

const StoreManagement = () => {
  const [stores, setStores] = useState([]);
  const [newStore, setNewStore] = useState({ name: '', address: '' });
  const [editingStore, setEditingStore] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const data = await storeService.getAllStores();
      setStores(data);
      setError(null);
    } catch (error) {
      setError('No se pudieron cargar las tiendas');
    }
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    try {
      const createdStore = await storeService.createStore(newStore);
      setStores([...stores, createdStore]);
      setNewStore({ name: '', address: '' });
      setError(null);
    } catch (error) {
      setError('No se pudo crear la tienda');
    }
  };

  const handleUpdateStore = async (e) => {
    e.preventDefault();
    try {
      const updatedStore = await storeService.updateStore(editingStore.id, editingStore);
      setStores(stores.map(store => 
        store.id === editingStore.id ? updatedStore : store
      ));
      setEditingStore(null);
      setError(null);
    } catch (error) {
      setError('No se pudo actualizar la tienda');
    }
  };

  const handleDeleteStore = async (id) => {
    try {
      await storeService.deleteStore(id);
      setStores(stores.filter(store => store.id !== id));
      setError(null);
    } catch (error) {
      setError('No se pudo eliminar la tienda');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Gestión de Tiendas</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      {/* Store Creation/Editing Form */}
      <form 
        onSubmit={editingStore ? handleUpdateStore : handleCreateStore} 
        className="mb-6 grid grid-cols-3 gap-4"
      >
        <input 
          type="text" 
          placeholder="Nombre de la Tienda" 
          value={editingStore ? editingStore.name : newStore.name}
          onChange={(e) => 
            editingStore 
              ? setEditingStore({...editingStore, name: e.target.value}) 
              : setNewStore({...newUser, name: e.target.value})
          }
          className="border p-2 rounded"
          required 
        />
        <input 
          type="text" 
          placeholder="Dirección" 
          value={editingStore ? editingStore.address : newStore.address}
          onChange={(e) => 
            editingStore 
              ? setEditingStore({...editingStore, address: e.target.value}) 
              : setNewStore({...newStore, address: e.target.value})
          }
          className="border p-2 rounded"
          required 
        />
        <button 
          type="submit" 
          className="bg-blue-500 text-white p-2 rounded"
        >
          {editingStore ? 'Actualizar Tienda' : 'Crear Tienda'}
        </button>
      </form>

      {/* Store List */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Dirección</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {stores.map(store => (
            <tr key={store.id}>
              <td className="border p-2">{store.id}</td>
              <td className="border p-2">{store.name}</td>
              <td className="border p-2">{store.address}</td>
              <td className="border p-2 text-center">
                <button 
                  onClick={() => setEditingStore(store)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                >
                  Editar
                </button>
                <button 
                  onClick={() => handleDeleteStore(store.id)}
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

export default StoreManagement;