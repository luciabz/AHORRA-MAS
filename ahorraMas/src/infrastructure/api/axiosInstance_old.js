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
    
    console.log('🌐 Environment Detection:', {
      hostname,
      protocol, 
      port,
      isDevelopment,
      envVariable: api
    });
    
    if (isDevelopment) {
      // En desarrollo, siempre usar HTTP directo
      console.log('🔧 DEVELOPMENT: Using direct HTTP connection');
      return 'http://3.85.57.147:8080';
    } else {
      // En producción (Vercel, Netlify, etc.)
      console.log('� PRODUCTION: Using proxy with relative URLs');
      console.log('� Requests will go to: /api/* and be proxied to backend');
      return ''; // URLs relativas que serán manejadas por el proxy
    }
  }
  
  // Fallback para entornos server-side (muy raro)
  console.log('🖥️ SERVER-SIDE: Using fallback HTTP');
  return 'http://3.85.57.147:8080';
};

const baseURL = getBaseURL();

console.log('� AXIOS CONFIGURATION FINAL:');
console.log('📍 Base URL:', baseURL || '(empty - using relative URLs for proxy)');
console.log('🔗 Strategy:', baseURL === '' ? '🔄 PROXY MODE - URLs will be /api/* → backend' : '🎯 DIRECT MODE - URLs will go directly to backend');
console.log('🌍 Current domain:', typeof window !== 'undefined' ? window.location.origin : 'server-side');

if (baseURL === '') {
  console.log('✅ PROXY EXPECTED BEHAVIOR:');
  console.log('   → Frontend request: /api/v1/auth/login'); 
  console.log('   → Vercel proxy to: http://3.85.57.147:8080/api/v1/auth/login');
  console.log('   → If this shows HTTP error, check vercel.json deployment');
}

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
