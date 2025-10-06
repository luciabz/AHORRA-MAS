import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * GoalApi - Cliente HTTP para operaciones de metas financieras
 * Responsabilidad: Solo comunicación con la API, sin lógica de negocio
 */
export const GoalApi = {
  /**
   * Crear una nueva meta
   */
  create: async (goalData, token) => {
    try {
      const response = await axios.post(`${API_URL}/api/v1/goal/`, goalData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('GoalApi.create error:', error);
      throw error;
    }
  },

  /**
   * Obtener todas las metas del usuario
   */
  list: async (token, filters = {}) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/goal/`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('GoalApi.list error:', error);
      throw error;
    }
  },

  /**
   * Obtener detalles de una meta específica
   */
  detail: async (id, token) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/goal/${id}/`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('GoalApi.detail error:', error);
      throw error;
    }
  },

  /**
   * Actualizar una meta existente
   */
  update: async (id, updateData, token) => {
    try {
      const response = await axios.patch(`${API_URL}/api/v1/goal/${id}/`, updateData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('GoalApi.update error:', error);
      throw error;
    }
  },

  /**
   * Eliminar una meta
   */
  remove: async (id, token) => {
    try {
      const response = await axios.delete(`${API_URL}/api/v1/goal/${id}/`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('GoalApi.remove error:', error);
      throw error;
    }
  },

  /**
   * Obtener metas activas
   */
  getActive: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/goal/active/`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('GoalApi.getActive error:', error);
      throw error;
    }
  },

  /**
   * Obtener metas completadas
   */
  getCompleted: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/goal/completed/`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('GoalApi.getCompleted error:', error);
      throw error;
    }
  },

  /**
   * Marcar meta como completada
   */
  complete: async (id, token) => {
    try {
      const response = await axios.patch(`${API_URL}/api/v1/goal/${id}/complete/`, {}, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('GoalApi.complete error:', error);
      throw error;
    }
  },

  /**
   * Reactivar una meta completada
   */
  reactivate: async (id, token) => {
    try {
      const response = await axios.patch(`${API_URL}/api/v1/goal/${id}/reactivate/`, {}, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('GoalApi.reactivate error:', error);
      throw error;
    }
  },

  /**
   * Obtener metas por tipo
   */
  getByType: async (type, token) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/goal/type/${type}/`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('GoalApi.getByType error:', error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas de metas
   */
  getStatistics: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/goal/statistics/`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('GoalApi.getStatistics error:', error);
      throw error;
    }
  },

  /**
   * Obtener metas que vencen pronto
   */
  getExpiring: async (days, token) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/goal/expiring/`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: { days }
      });
      return response.data;
    } catch (error) {
      console.error('GoalApi.getExpiring error:', error);
      throw error;
    }
  }
};
