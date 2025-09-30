import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const ScheduleTransactionApi = {
  // Listar todas las transacciones programadas
  list: async (token) => {
    const res = await axios.get(`${API_URL}/api/v1/schedule-transaction/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },

  // Crear una nueva transacción programada
  create: async (scheduleTransaction, token) => {
    const res = await axios.post(`${API_URL}/api/v1/schedule-transaction/`, scheduleTransaction, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },

  // Obtener detalle de una transacción programada
  detail: async (id, token) => {
    const res = await axios.get(`${API_URL}/api/v1/schedule-transaction/${id}/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },

  // Actualizar una transacción programada
  update: async (id, data, token) => {
    const res = await axios.patch(`${API_URL}/api/v1/schedule-transaction/${id}/`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },

  // Eliminar una transacción programada
  remove: async (id, token) => {
    const res = await axios.delete(`${API_URL}/api/v1/schedule-transaction/${id}/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  }
};
