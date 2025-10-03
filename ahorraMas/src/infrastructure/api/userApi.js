import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * UserApi - Cliente HTTP para operaciones de usuarios
 * Responsabilidad: Solo comunicación con la API, sin lógica de negocio
 */
export const UserApi = {
  /**
   * Obtener información del usuario autenticado
   */
  me: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/auth/me/`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('UserApi.me error:', error);
      throw error;
    }
  },

  /**
   * Actualizar perfil del usuario
   */
  updateProfile: async (userData, token) => {
    try {
      const response = await axios.patch(`${API_URL}/api/v1/auth/profile/`, userData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('UserApi.updateProfile error:', error);
      throw error;
    }
  },

  /**
   * Cambiar contraseña
   */
  changePassword: async (passwordData, token) => {
    try {
      const response = await axios.post(`${API_URL}/api/v1/auth/change-password/`, passwordData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('UserApi.changePassword error:', error);
      throw error;
    }
  },

  /**
   * Eliminar cuenta de usuario
   */
  deleteAccount: async (token) => {
    try {
      const response = await axios.delete(`${API_URL}/api/v1/auth/delete-account/`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('UserApi.deleteAccount error:', error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas del usuario
   */
  getStatistics: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/auth/statistics/`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('UserApi.getStatistics error:', error);
      throw error;
    }
  }
};
