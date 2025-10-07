declare global {
  interface ImportMetaEnv {
    readonly VITE_URL_API?: string;
    
    readonly VITE_LOGO?: string;
    readonly VERSION?: string;
    readonly PORT?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }

  interface Window {
    env?: { [key: string]: any };
  }
}
// Función para obtener la URL de la API según el entorno
const getApiUrl = () => {
  // Primera prioridad: variable de entorno explícita
  const envApi = import.meta.env.VITE_URL_API || (typeof window !== 'undefined' ? window.env?.VITE_URL_API : '');
  
  console.log('🔍 API URL Detection in constant.tsx:');
  console.log('  - import.meta.env.VITE_URL_API:', import.meta.env.VITE_URL_API);
  console.log('  - window.env?.VITE_URL_API:', typeof window !== 'undefined' ? window.env?.VITE_URL_API : 'N/A');
  console.log('  - Final envApi value:', envApi);
  
  // Si hay una variable de entorno definida, usarla (incluso si está vacía para forzar proxy)
  if (envApi !== undefined) {
    console.log('📦 Using environment variable:', envApi === '' ? '(empty string - PROXY MODE)' : envApi);
    return envApi;
  }
  
  // Segunda prioridad: detección automática del entorno
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const port = window.location.port;
    const protocol = window.location.protocol;
    
    // Detección más robusta incluyendo dominios de Vercel
    const isDevelopment = hostname === 'localhost' || 
                         hostname === '127.0.0.1' ||
                         port === '5173' ||
                         port === '3000' ||
                         port === '4173';
    
    // Detección específica de Vercel
    const isVercel = hostname.includes('.vercel.app') || 
                     hostname.includes('.now.sh') ||
                     hostname.includes('ahorra-mas.vercel.app');
    
    console.log('🌍 Environment Detection Details:');
    console.log('  - hostname:', hostname);
    console.log('  - port:', port);
    console.log('  - protocol:', protocol);
    console.log('  - isDevelopment:', isDevelopment);
    console.log('  - isVercel:', isVercel);
    
    if (isDevelopment) {
      // Desarrollo: HTTP directo
      console.log('🔧 DEVELOPMENT MODE: Using direct HTTP connection');
      return 'http://3.85.57.147:8080';
    } else {
      // Producción: proxy relativo (incluye Vercel)
      console.log('🚀 PRODUCTION MODE: Using proxy with relative URLs');
      console.log('🔄 All requests will be /api/* and proxied by serverless function');
      return '';
    }
  }
  
  // Fallback para entornos server-side
  console.log('🖥️ SERVER-SIDE fallback');
  return 'http://3.85.57.147:8080';
};

export const api = getApiUrl();
export const port = import.meta.env.PORT || window.env?.PORT || "9002";
export const logo = import.meta.env.VITE_LOGO || window.env?.VITE_LOGO;
export const version = import.meta.env.VERSION || window.env?.VERSION;