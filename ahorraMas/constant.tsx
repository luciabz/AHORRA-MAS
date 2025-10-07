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
const getApiUrl = () => {
  // PRIMERA PRIORIDAD: Detección de Vercel por hostname (más confiable que variables de entorno)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const port = window.location.port;
    const protocol = window.location.protocol;
    
   
    const isVercel = hostname.includes('.vercel.app') || 
                     hostname.includes('.now.sh') ||
                     hostname === 'ahorra-mas.vercel.app';
    
    const isDevelopment = hostname === 'localhost' || 
                         hostname === '127.0.0.1' ||
                         port === '5173' ||
                         port === '3000' ||
                         port === '4173';
    
    
    
    if (isVercel) {
      return '';
    } else if (isDevelopment) {
      return 'http://3.85.57.147:8080';
    }
  }
  
  // SEGUNDA PRIORIDAD: variable de entorno (para otros entornos de producción)
  const envApi = import.meta.env.VITE_URL_API || (typeof window !== 'undefined' ? window.env?.VITE_URL_API : undefined);
  
  if (typeof envApi === 'string') {
    if (envApi === '') {
      return '';
    } else {
      return envApi;
    }
  }
  
  // Fallback para entornos server-side o desconocidos
  return '';
};

export const api = getApiUrl();
export const port = import.meta.env.PORT || window.env?.PORT || "9002";
export const logo = import.meta.env.VITE_LOGO || window.env?.VITE_LOGO;
export const version = import.meta.env.VERSION || window.env?.VERSION;