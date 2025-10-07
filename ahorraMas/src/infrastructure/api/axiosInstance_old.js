import axios from 'axios';
import { api } from '../../../constant';

// Función para determinar la URL base apropiada
const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const port = window.location.port;
    
    // Detección robusta de desarrollo
    const isDevelopment = hostname === 'localhost' || 
                         hostname === '127.0.0.1' ||
                         port === '5173' ||
                         port === '3000' ||
                         port === '4173'; // Vite preview
    
    if (isDevelopment) {
      // En desarrollo, siempre usar HTTP directo
      return 'http://3.85.57.147:8080';
    } else {
      // En producción (Vercel, Netlify, etc.)
      return ''; // URLs relativas que serán manejadas por el proxy
    }
  }
  
  // Fallback para entornos server-side (muy raro)
  return 'http://3.85.57.147:8080';
};

const baseURL = getBaseURL();



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
    
    if (error.response?.status === 400 || error.response?.status === 409) {
    }
    
    return Promise.reject(error);
  }
);


export default axiosInstance;
