import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const TransactionApi = {
  // Listar todas las transacciones (ingresos y egresos)
  list: async (token) => {
    const res = await axios.get(`${API_URL}/api/v1/transaction/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },

  // Crear una nueva transacción
  create: async (transaction, token) => {
    const res = await axios.post(`${API_URL}/api/v1/transaction/`, transaction, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },

  // Obtener detalle de una transacción
  detail: async (id, token) => {
    const res = await axios.get(`${API_URL}/api/v1/transaction/${id}/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },

  // Actualizar una transacción
  update: async (id, data, token) => {
    const res = await axios.patch(`${API_URL}/api/v1/transaction/${id}/`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },

  // Eliminar una transacción
  remove: async (id, token) => {
    const res = await axios.delete(`${API_URL}/api/v1/transaction/${id}/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  }
};
