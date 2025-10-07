import axios from 'axios';
import { api } from '../../../constant';

// Función para determinar la URL base apropiada
const getBaseURL = () => {
  // Detectar el entorno automáticamente
  if (typeof window !== 'undefined') {
    const isDevelopment = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1' ||
                         window.location.port === '5173' || // Vite dev server
                         window.location.port === '3000';   // Otros dev servers
    
    if (isDevelopment) {
      // En desarrollo, usar HTTP directo al backend
      console.log('🔧 Development environment detected - using direct HTTP');
      return 'http://3.85.57.147:8080';
    } else {
      // En producción, verificar si hay variable de entorno
      if (api && api.trim() !== '') {
        // Si hay URL específica configurada, usarla
        console.log('🔧 Using configured API URL:', api);
        return api;
      } else {
        // En producción sin URL específica, usar proxy (URL relativa)
        console.log('🚀 Production environment detected - using relative URLs (proxy)');
        return '';
      }
    }
  }
  
  // Fallback para entornos server-side - usar variable de entorno o HTTP directo
  return api || 'http://3.85.57.147:8080';
};

const baseURL = getBaseURL();

console.log('🌐 API Configuration:', {
  hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
  protocol: typeof window !== 'undefined' ? window.location.protocol : 'unknown',
  port: typeof window !== 'undefined' ? window.location.port : 'unknown',
  envApiVariable: api,
  resolvedBaseURL: baseURL,
  isProduction: typeof window !== 'undefined' && 
                window.location.hostname !== 'localhost' && 
                window.location.hostname !== '127.0.0.1',
  strategy: baseURL === '' ? 'PROXY (relative URLs)' : 'DIRECT HTTP'
});

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
      message: error.message,
      code: error.code
    });
    
    // Manejo específico de errores de red
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.error('🌐 Network error detected - possible HTTPS/SSL issue');
      
      // Si estamos en HTTPS y hay error de red, podría ser problema de certificado SSL
      if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
        console.error('🔒 HTTPS context detected - API might not support HTTPS or have SSL issues');
        
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
      console.error('🚫 Validation/Conflict error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);


export default axiosInstance;
