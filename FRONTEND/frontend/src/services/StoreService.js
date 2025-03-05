import axios from 'axios';
import { authService } from './authService';

const API_URL = 'http://localhost:8080/stores';

export const storeService = {
  // Fetch all stores
  getAllStores: async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching stores:', error);
      throw error;
    }
  },

  // Create a new store
  createStore: async (storeData) => {
    try {
      const response = await axios.post(API_URL, storeData, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating store:', error);
      throw error;
    }
  },

  // Update an existing store
  updateStore: async (id, storeData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, storeData, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating store:', error);
      throw error;
    }
  },

  // Delete a store
  deleteStore: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        }
      });
    } catch (error) {
      console.error('Error deleting store:', error);
      throw error;
    }
  }
};