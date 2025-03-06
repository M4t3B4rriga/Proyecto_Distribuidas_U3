import axios from 'axios';
import { authService } from './authService';

const API_URL = 'http://localhost:8082/products';

export const productService = {
  // Fetch all products
  getAllProducts: async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: { 'Authorization': `Bearer ${authService.getToken()}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Create a new product (Admin only)
  createProduct: async (productData) => {
    try {
      const response = await axios.post(API_URL, productData, {
        headers: { 'Authorization': `Bearer ${authService.getToken()}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Update a product (Admin only)
  updateProduct: async (id, productData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, productData, {
        headers: { 'Authorization': `Bearer ${authService.getToken()}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Delete a product (Admin only)
  deleteProduct: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { 'Authorization': `Bearer ${authService.getToken()}` }
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
};