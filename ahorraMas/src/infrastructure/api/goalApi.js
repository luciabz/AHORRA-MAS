import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const GoalApi = {
  // Crear una meta
  create: async (goal, token) => {
    const res = await axios.post(`${API_URL}/api/v1/goal/`, goal, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },

  // Listar todas las metas
  list: async (token) => {
    const res = await axios.get(`${API_URL}/api/v1/goal/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },

  // Obtener detalle de una meta
  detail: async (id, token) => {
    const res = await axios.get(`${API_URL}/api/v1/goal/${id}/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },

  // Editar una meta (solo description y targetAmount)
  update: async (id, data, token) => {
    const res = await axios.patch(`${API_URL}/api/v1/goal/${id}/`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },

  // Eliminar una meta
  remove: async (id, token) => {
    const res = await axios.delete(`${API_URL}/api/v1/goal/${id}/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  }
};
