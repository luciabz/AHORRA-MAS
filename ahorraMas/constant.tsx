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
  console.log('🔍 STARTING API URL Detection in constant.tsx');
  console.log('🔍 All import.meta.env:', import.meta.env);
  
  // PRIMERA PRIORIDAD: Detección de Vercel por hostname (más confiable que variables de entorno)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const port = window.location.port;
    const protocol = window.location.protocol;
    
    console.log('🌍 Window Location Details:');
    console.log('  - full URL:', window.location.href);
    console.log('  - hostname:', hostname);
    console.log('  - port:', port);
    console.log('  - protocol:', protocol);
    
    // Detección específica de Vercel (FORZAR PROXY)
    const isVercel = hostname.includes('.vercel.app') || 
                     hostname.includes('.now.sh') ||
                     hostname === 'ahorra-mas.vercel.app';
    
    // Detección de desarrollo
    const isDevelopment = hostname === 'localhost' || 
                         hostname === '127.0.0.1' ||
                         port === '5173' ||
                         port === '3000' ||
                         port === '4173';
    
    console.log('🎯 Environment Classification:');
    console.log('  - isDevelopment:', isDevelopment);
    console.log('  - isVercel:', isVercel);
    
    if (isVercel) {
      console.log('🚀 VERCEL DETECTED: FORCING PROXY MODE (ignoring env vars)');
      console.log('🔄 This will use /api/* URLs that get proxied to backend');
      return '';
    } else if (isDevelopment) {
      console.log('🔧 DEVELOPMENT DETECTED: Using direct HTTP');
      return 'http://3.85.57.147:8080';
    }
  }
  
  // SEGUNDA PRIORIDAD: variable de entorno (para otros entornos de producción)
  const envApi = import.meta.env.VITE_URL_API || (typeof window !== 'undefined' ? window.env?.VITE_URL_API : undefined);
  
  console.log('🔍 Environment Variables Check (fallback):');
  console.log('  - import.meta.env.VITE_URL_API:', import.meta.env.VITE_URL_API);
  console.log('  - typeof VITE_URL_API:', typeof import.meta.env.VITE_URL_API);
  console.log('  - window.env?.VITE_URL_API:', typeof window !== 'undefined' ? window.env?.VITE_URL_API : 'N/A');
  console.log('  - Final envApi value:', envApi);
  
  if (typeof envApi === 'string') {
    if (envApi === '') {
      console.log('✅ Environment variable: PROXY MODE');
      return '';
    } else {
      console.log('🎯 Environment variable: DIRECT MODE -', envApi);
      return envApi;
    }
  }
  
  // Fallback para entornos server-side o desconocidos
  console.log('🖥️ FALLBACK: Using proxy mode for unknown environment');
  return '';
};

export const api = getApiUrl();
export const port = import.meta.env.PORT || window.env?.PORT || "9002";
export const logo = import.meta.env.VITE_LOGO || window.env?.VITE_LOGO;
export const version = import.meta.env.VERSION || window.env?.VERSION;