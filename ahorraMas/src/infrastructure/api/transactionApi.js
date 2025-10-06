import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * TransactionApi - Cliente HTTP para operaciones de transacciones
 * Responsabilidad: Solo comunicación con la API, sin lógica de negocio
 */
export const TransactionApi = {
  /**
   * Obtener todas las transacciones del usuario autenticado
   */
  list: async (token, filters = {}) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/transaction/`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('TransactionApi.list error:', error);
      throw error;
    }
  },

  /**
   * Crear una nueva transacción
   */
  create: async (transactionData, token) => {
    try {
      const response = await axios.post(`${API_URL}/api/v1/transaction/`, transactionData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('TransactionApi.create error:', error);
      throw error;
    }
  },

  /**
   * Obtener detalles de una transacción específica
   */
  detail: async (id, token) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/transaction/${id}/`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('TransactionApi.detail error:', error);
      throw error;
    }
  },

  /**
   * Actualizar una transacción existente
   */
  update: async (id, updateData, token) => {
    try {
      const response = await axios.patch(`${API_URL}/api/v1/transaction/${id}/`, updateData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('TransactionApi.update error:', error);
      throw error;
    }
  },

  /**
   * Eliminar una transacción
   */
  remove: async (id, token) => {
    try {
      const response = await axios.delete(`${API_URL}/api/v1/transaction/${id}/`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('TransactionApi.remove error:', error);
      throw error;
    }
  },

  /**
   * Obtener transacciones por categoría
   */
  getByCategory: async (categoryId, token) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/transaction/`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: { categoryId }
      });
      return response.data;
    } catch (error) {
      console.error('TransactionApi.getByCategory error:', error);
      throw error;
    }
  },

  /**
   * Obtener transacciones por rango de fechas
   */
  getByDateRange: async (startDate, endDate, token) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/transaction/`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: { 
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      });
      return response.data;
    } catch (error) {
      console.error('TransactionApi.getByDateRange error:', error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas de transacciones
   */
  getStatistics: async (token, period = 'month') => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/transaction/statistics/`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: { period }
      });
      return response.data;
    } catch (error) {
      console.error('TransactionApi.getStatistics error:', error);
      throw error;
    }
  }
};
