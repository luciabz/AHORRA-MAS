import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * CategoryApi - Cliente HTTP para operaciones de categorías
 * Responsabilidad: Solo comunicación con la API, sin lógica de negocio
 */
export const CategoryApi = {
  /**
   * Obtener todas las categorías del usuario autenticado
   */
  list: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/category/`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('CategoryApi.list error:', error);
      throw error;
    }
  },

  /**
   * Crear una nueva categoría
   */
  create: async (categoryData, token) => {
    try {
      const response = await axios.post(`${API_URL}/api/v1/category/`, categoryData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('CategoryApi.create error:', error);
      throw error;
    }
  },

  /**
   * Obtener detalles de una categoría específica
   */
  detail: async (id, token) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/category/${id}/`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('CategoryApi.detail error:', error);
      throw error;
    }
  },

  /**
   * Actualizar una categoría existente
   */
  update: async (id, updateData, token) => {
    try {
      const response = await axios.patch(`${API_URL}/api/v1/category/${id}/`, updateData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('CategoryApi.update error:', error);
      throw error;
    }
  },

  /**
   * Eliminar una categoría
   */
  remove: async (id, token) => {
    try {
      const response = await axios.delete(`${API_URL}/api/v1/category/${id}/`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('CategoryApi.remove error:', error);
      throw error;
    }
  },

  /**
   * Verificar si una categoría puede ser eliminada
   */
  canDelete: async (id, token) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/category/${id}/can-delete/`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      // Si el endpoint no existe, retornar que sí se puede eliminar
      if (error.response?.status === 404) {
        return { canDelete: true };
      }
      console.error('CategoryApi.canDelete error:', error);
      throw error;
    }
  }
};
