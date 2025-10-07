import axios from 'axios';
import { api } from '../../../constant';

// Usar la configuración de constant.tsx que incluye toda la lógica de detección de entorno
const baseURL = api;

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
    if (response.status === 204) {
      response.data = {
        success: true,
        message: 'Operación exitosa'
      };
    }
    
    return response;
  },
  (error) => {
    // Manejo específico de errores de red
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      // Si estamos en HTTPS y hay error de red, podría ser problema de certificado SSL
      if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
        
        // Crear un error más descriptivo
        const enhancedError = new Error(
          'Error de conexión: No se puede conectar al servidor. ' +
          'Esto puede deberse a que el servidor no soporta HTTPS o tiene problemas de certificado SSL.'
        );
        enhancedError.original = error;
        enhancedError.isNetworkError = true;
        return Promise.reject(enhancedError);
      }
    }
    

    
    return Promise.reject(error);
  }
);

export default axiosInstance;
