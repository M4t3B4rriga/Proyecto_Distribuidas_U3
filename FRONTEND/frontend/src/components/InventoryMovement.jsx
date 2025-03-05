import React, { useState, useEffect } from 'react';
import { inventoryService } from '../services/InventoryService';
import { storeService } from '../services/StoreService';

const InventoryMovements = () => {
  const [movements, setMovements] = useState([]);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState('');
  const [movementMetrics, setMovementMetrics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStores();
    fetchMovementMetrics();
  }, []);

  const fetchStores = async () => {
    try {
      const data = await storeService.getAllStores();
      setStores(data);
    } catch (error) {
      setError('No se pudieron cargar las tiendas');
    }
  };

  const fetchMovements = async (storeId = null) => {
    try {
      const data = storeId 
        ? await inventoryService.getMovementsByStore(storeId)
        : await inventoryService.getAllMovements();
      setMovements(data);
      setError(null);
    } catch (error) {
      setError('No se pudieron cargar los movimientos de inventario');
    }
  };

  const fetchMovementMetrics = async () => {
    try {
      const metrics = await inventoryService.getMovementMetrics();
      setMovementMetrics(metrics);
    } catch (error) {
      setError('No se pudieron cargar las métricas de movimientos');
    }
  };

  const handleStoreFilter = (e) => {
    const storeId = e.target.value;
    setSelectedStore(storeId);
    if (storeId) {
      fetchMovements(storeId);
    } else {
      fetchMovements();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Movimientos de Inventario</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      {/* Movement Metrics */}
      {movementMetrics && (
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div className="bg-blue-100 p-4 rounded">
            <h3 className="font-bold">Entradas</h3>
            <p className="text-2xl">{movementMetrics['ENTRY'] || 0}</p>
          </div>
          <div className="bg-red-100 p-4 rounded">
            <h3 className="font-bold">Salidas</h3>
            <p className="text-2xl">{movementMetrics['EXIT'] || 0}</p>
          </div>
        </div>
      )}

      {/* Store Filter */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Filtrar por Tienda</label>
        <select 
          value={selectedStore}
          onChange={handleStoreFilter}
          className="w-full border p-2 rounded"
        >
          <option value="">Todas las Tiendas</option>
          {stores.map(store => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select>
      </div>

      {/* Movements Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Tienda</th>
            <th className="border p-2">Producto</th>
            <th className="border p-2">Cantidad</th>
            <th className="border p-2">Tipo de Movimiento</th>
            <th className="border p-2">Fecha</th>
            <th className="border p-2">Usuario</th>
          </tr>
        </thead>
        <tbody>
          {movements.map(movement => (
            <tr key={movement.id}>
              <td className="border p-2">{movement.id}</td>
              <td className="border p-2">{movement.storeId}</td>
              <td className="border p-2">{movement.productId}</td>
              <td className="border p-2">{movement.quantity}</td>
              <td className="border p-2">
                <span className={`
                  px-2 py-1 rounded 
                  ${movement.movementType === 'ENTRY' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}
                `}>
                  {movement.movementType}
                </span>
              </td>
              <td className="border p-2">
                {new Date(movement.movementDate).toLocaleString()}
              </td>
              <td className="border p-2">{movement.userId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryMovements;