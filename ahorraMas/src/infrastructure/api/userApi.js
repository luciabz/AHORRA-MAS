import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const UserApi = {
  me: async (token) => {
    const res = await axios.get(`${API_URL}/api/v1/auth/me/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  }
};
