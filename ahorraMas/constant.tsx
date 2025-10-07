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
  
  // Primera prioridad: variable de entorno explícita
  const envApi = import.meta.env.VITE_URL_API || (typeof window !== 'undefined' ? window.env?.VITE_URL_API : undefined);
  
  console.log('🔍 Environment Variables Check:');
  console.log('  - import.meta.env.VITE_URL_API:', import.meta.env.VITE_URL_API);
  console.log('  - typeof VITE_URL_API:', typeof import.meta.env.VITE_URL_API);
  console.log('  - window.env?.VITE_URL_API:', typeof window !== 'undefined' ? window.env?.VITE_URL_API : 'N/A');
  console.log('  - Final envApi value:', envApi);
  console.log('  - envApi === "":', envApi === '');
  console.log('  - envApi !== undefined:', envApi !== undefined);
  
  // FORZAR MODO PROXY para producción si la variable está definida como cadena vacía
  if (typeof envApi === 'string') {
    console.log('📦 USING ENVIRONMENT VARIABLE (string detected)');
    if (envApi === '') {
      console.log('✅ FORCED PROXY MODE - Empty string detected');
      return '';
    } else {
      console.log('🎯 DIRECT MODE - URL provided:', envApi);
      return envApi;
    }
  }
  
  // Segunda prioridad: detección automática del entorno
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const port = window.location.port;
    const protocol = window.location.protocol;
    
    console.log('🌍 Window Location Details:');
    console.log('  - full URL:', window.location.href);
    console.log('  - hostname:', hostname);
    console.log('  - port:', port);
    console.log('  - protocol:', protocol);
    
    // Detección específica de Vercel (más prioritaria)
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
      console.log('🚀 VERCEL DETECTED: Using proxy mode');
      return '';
    } else if (isDevelopment) {
      console.log('🔧 DEVELOPMENT DETECTED: Using direct HTTP');
      return 'http://3.85.57.147:8080';
    } else {
      console.log('🌐 OTHER PRODUCTION: Using proxy mode');
      return '';
    }
  }
  
  // Fallback para entornos server-side
  console.log('🖥️ SERVER-SIDE fallback - using direct HTTP');
  return 'http://3.85.57.147:8080';
};

export const api = getApiUrl();
export const port = import.meta.env.PORT || window.env?.PORT || "9002";
export const logo = import.meta.env.VITE_LOGO || window.env?.VITE_LOGO;
export const version = import.meta.env.VERSION || window.env?.VERSION;