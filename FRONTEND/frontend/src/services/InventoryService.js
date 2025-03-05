import axios from 'axios';
import { authService } from './authService';

const API_URL = 'http://localhost:8081/inventory';

export const inventoryService = {
  // Update stock for a specific store and product
  updateStock: async (storeId, productId, quantity, userId, movementType) => {
    try {
      const response = await axios.put(
        `${API_URL}/${storeId}/${productId}`, 
        null, 
        {
          params: { quantity, userId, movementType },
          headers: {
            'Authorization': `Bearer ${authService.getToken()}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  },

  // Get inventory movements (admin-only)
  getAllMovements: async () => {
    try {
      const response = await axios.get(`${API_URL}/movements`, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching inventory movements:', error);
      throw error;
    }
  },

  // Get movements by store (admin-only)
  getMovementsByStore: async (storeId) => {
    try {
      const response = await axios.get(`${API_URL}/movements/${storeId}`, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching inventory movements for store ${storeId}:`, error);
      throw error;
    }
  },

  // Get movement metrics (admin-only)
  getMovementMetrics: async () => {
    try {
      const response = await axios.get(`${API_URL}/movements/metrics`, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching inventory movement metrics:', error);
      throw error;
    }
  }
};