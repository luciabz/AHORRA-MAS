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
  
  // Si hay una variable de entorno definida, usarla (incluso si está vacía para forzar proxy)
  if (envApi !== undefined) {
    return envApi;
  }
  
  // Segunda prioridad: detección automática del entorno
  if (typeof window !== 'undefined') {
    const isDevelopment = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1' ||
                         window.location.port === '5173' ||
                         window.location.port === '3000';
    
    if (isDevelopment) {
      // Desarrollo: HTTP directo
      console.log('🔧 Auto-detected: Development environment');
      return 'http://3.85.57.147:8080';
    } else {
      // Producción: proxy relativo
      console.log('🚀 Auto-detected: Production environment (using proxy)');
      return '';
    }
  }
  
  // Fallback para entornos server-side
  return 'http://3.85.57.147:8080';
};

export const api = getApiUrl();
export const port = import.meta.env.PORT || window.env?.PORT || "9002";
export const logo = import.meta.env.VITE_LOGO || window.env?.VITE_LOGO;
export const version = import.meta.env.VERSION || window.env?.VERSION;