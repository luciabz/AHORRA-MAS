import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * ScheduleTransactionApi - Cliente HTTP para operaciones de transacciones programadas
 * Responsabilidad: Solo comunicación con la API, sin lógica de negocio
 */
export const ScheduleTransactionApi = {
  /**
   * Obtener todas las transacciones programadas del usuario
   */
  list: async (token, filters = {}) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/schedule-transaction/`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('ScheduleTransactionApi.list error:', error);
      throw error;
    }
  },

  /**
   * Crear una nueva transacción programada
   */
  create: async (scheduleData, token) => {
    try {
      const response = await axios.post(`${API_URL}/api/v1/schedule-transaction/`, scheduleData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('ScheduleTransactionApi.create error:', error);
      throw error;
    }
  },

  /**
   * Obtener detalles de una transacción programada específica
   */
  detail: async (id, token) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/schedule-transaction/${id}/`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('ScheduleTransactionApi.detail error:', error);
      throw error;
    }
  },

  /**
   * Actualizar una transacción programada existente
   */
  update: async (id, updateData, token) => {
    try {
      const response = await axios.patch(`${API_URL}/api/v1/schedule-transaction/${id}/`, updateData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('ScheduleTransactionApi.update error:', error);
      throw error;
    }
  },

  /**
   * Eliminar una transacción programada
   */
  remove: async (id, token) => {
    try {
      const response = await axios.delete(`${API_URL}/api/v1/schedule-transaction/${id}/`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('ScheduleTransactionApi.remove error:', error);
      throw error;
    }
  },

  /**
   * Obtener transacciones programadas activas
   */
  getActive: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/schedule-transaction/active/`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('ScheduleTransactionApi.getActive error:', error);
      throw error;
    }
  },

  /**
   * Obtener transacciones programadas pendientes de ejecución
   */
  getPending: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/schedule-transaction/pending/`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('ScheduleTransactionApi.getPending error:', error);
      throw error;
    }
  },

  /**
   * Actualizar contador de ejecuciones
   */
  updateExecution: async (id, executionData, token) => {
    try {
      const response = await axios.patch(`${API_URL}/api/v1/schedule-transaction/${id}/execution/`, executionData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('ScheduleTransactionApi.updateExecution error:', error);
      throw error;
    }
  },

  /**
   * Cambiar estado activo/inactivo
   */
  toggleActive: async (id, isActive, token) => {
    try {
      const response = await axios.patch(`${API_URL}/api/v1/schedule-transaction/${id}/toggle/`, 
        { isActive }, 
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('ScheduleTransactionApi.toggleActive error:', error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas de transacciones programadas
   */
  getStatistics: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/schedule-transaction/statistics/`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('ScheduleTransactionApi.getStatistics error:', error);
      throw error;
    }
  }
};
