import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const CategoryApi = {
  // Listar todas las categorías
  list: async (token) => {
    const res = await axios.get(`${API_URL}/api/v1/category/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },

  // Crear una nueva categoría
  create: async (category, token) => {
    const res = await axios.post(`${API_URL}/api/v1/category/`, category, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },

  // Obtener detalle de una categoría
  detail: async (id, token) => {
    const res = await axios.get(`${API_URL}/api/v1/category/${id}/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },

  // Actualizar una categoría
  update: async (id, data, token) => {
    const res = await axios.patch(`${API_URL}/api/v1/category/${id}/`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },

  // Eliminar una categoría
  remove: async (id, token) => {
    const res = await axios.delete(`${API_URL}/api/v1/category/${id}/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  }
};
