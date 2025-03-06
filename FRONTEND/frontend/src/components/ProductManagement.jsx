import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { storeService } from '../services/storeService';
import { authService } from '../services/authService';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]); // Stores for dropdown
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '', storeId: '' });
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchStores();
    const token = authService.getToken();
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUserRole(decodedToken.role);
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
      setError(null);
    } catch (error) {
      setError('No se pudieron cargar los productos');
    }
  };

  const fetchStores = async () => {
    try {
      const data = await storeService.getAllStores();
      setStores(data);
    } catch (error) {
      setError('No se pudieron cargar las tiendas');
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (userRole !== 'ADMIN') return;
    try {
      const createdProduct = await productService.createProduct(newProduct);
      setProducts([...products, createdProduct]);
      setNewProduct({ name: '', price: '', category: '', storeId: '' });
      setError(null);
    } catch (error) {
      setError('No se pudo crear el producto');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (userRole !== 'ADMIN') return;
    try {
      await productService.deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
      setError(null);
    } catch (error) {
      setError('No se pudo eliminar el producto');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;
    try {
      await productService.updateProduct(editingProduct.id, editingProduct);
      setProducts(products.map(p => (p.id === editingProduct.id ? editingProduct : p)));
      setEditingProduct(null);
    } catch (error) {
      setError('No se pudo actualizar el producto');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Gestión de Productos</h2>

      {error && <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</p>}

      {/* Admin Only: Product Creation Form */}
      {userRole === 'ADMIN' && (
        <form onSubmit={handleCreateProduct} className="mb-6 flex gap-4 items-center">
          <input type="text" placeholder="Nombre" className="border p-2 rounded w-1/5" value={newProduct.name}
            onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} required />
          <input type="number" placeholder="Precio" className="border p-2 rounded w-1/5" value={newProduct.price}
            onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} required />
          <input type="text" placeholder="Categoría" className="border p-2 rounded w-1/5" value={newProduct.category}
            onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} required />
          
          {/* Store Selection Dropdown */}
          <select className="border p-2 rounded w-1/5" value={newProduct.storeId}
            onChange={(e) => setNewProduct({ ...newProduct, storeId: e.target.value })} required>
            <option value="">Seleccione una tienda</option>
            {stores.map(store => (
              <option key={store.id} value={store.id}>{store.name}</option>
            ))}
          </select>

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Crear Producto</button>
        </form>
      )}

      <table className="w-full border-collapse bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="border p-2">ID</th>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Precio</th>
            <th className="border p-2">Categoría</th>
            <th className="border p-2">Tienda</th>
            {userRole === 'ADMIN' && <th className="border p-2">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} className="border-b hover:bg-gray-100 transition">
              <td className="border p-2">{p.id}</td>
              <td className="border p-2">
                {editingProduct?.id === p.id ? (
                  <input type="text" value={editingProduct.name} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} className="border p-2 rounded w-full"/>
                ) : (
                  p.name
                )}
              </td>
              <td className="border p-2">
                {editingProduct?.id === p.id ? (
                  <input type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})} className="border p-2 rounded w-full"/>
                ) : (
                  `$${p.price}`
                )}
              </td>
              <td className="border p-2">
                {editingProduct?.id === p.id ? (
                  <input type="text" value={editingProduct.category} onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})} className="border p-2 rounded w-full"/>
                ) : (
                  p.category
                )}
              </td>
              <td className="border p-2">
                {stores.find(store => store.id === p.storeId)?.name || 'N/A'}
              </td>
              {userRole === 'ADMIN' && (
                <td className="border p-2 text-center">
                  {editingProduct?.id === p.id ? (
                    <button onClick={handleSaveEdit} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition mr-2">
                      Guardar
                    </button>
                  ) : (
                    <>
                      <button onClick={() => handleEditProduct(p)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition mr-2">
                        Editar
                      </button>
                      <button onClick={() => handleDeleteProduct(p.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                        Eliminar
                      </button>
                    </>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManagement;