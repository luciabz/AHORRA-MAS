import axios from 'axios';
import { api } from '../../../constant';

const baseURL = api || 'http://3.85.57.147:8080';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Debug: mostrar la URL completa
  console.log('📡 Making request to:', `${config.baseURL}${config.url}`);
  console.log('📡 Request method:', config.method);
  console.log('📡 Request headers:', config.headers);
  
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    console.log('📥 Response received:', {
      url: response.config.url,
      status: response.status,
      statusText: response.statusText
    });
    return response;
  },
  (error) => {
    console.error('📥 Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);


export default axiosInstance;
