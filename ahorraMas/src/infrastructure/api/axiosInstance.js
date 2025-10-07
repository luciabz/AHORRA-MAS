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
  

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    console.log('📥 Response received:', {
      url: response.config.url,
      status: response.status,
      statusText: response.statusText,
      hasData: !!response.data,
      dataKeys: response.data ? Object.keys(response.data) : []
    });
    
    if (response.status === 204) {
      console.log('✅ Status 204 - Creating success response');
      response.data = {
        success: true,
        message: 'Operación exitosa'
      };
    }
    
    return response;
  },
  (error) => {
    console.error('❌ Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 400 || error.response?.status === 409) {
      console.error('🚫 Validation/Conflict error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);


export default axiosInstance;
