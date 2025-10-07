# 🔗 Frontend HTTPS ↔ Backend HTTP - Configuración de Proxy

## 🎯 Objetivo
Frontend desplegado en HTTPS (Vercel) debe comunicarse con Backend en HTTP sin errores de Mixed Content.

## 🚀 Solución Implementada: Doble Proxy

### 1. **Proxy Principal: Vercel Rewrites** 
```json
// vercel.json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "http://3.85.57.147:8080/api/:path*"
    }
  ]
}
```

### 2. **Proxy Fallback: Función Serverless**
```javascript
// api/[...path].js - Maneja casos complejos y errores
```

## 🔄 Flujo de Comunicación

### Desarrollo Local (localhost)
```
Frontend → http://3.85.57.147:8080/api/v1/auth/login
```

### Producción (Vercel HTTPS)
```
Frontend → /api/v1/auth/login 
         ↓ Vercel Rewrite
         → http://3.85.57.147:8080/api/v1/auth/login
```

## ⚙️ Configuración por Entorno

### `.env.development`
```env
VITE_URL_API=http://3.85.57.147:8080
```

### `.env.production` 
```env
VITE_URL_API=
# Vacío = usar URLs relativas (proxy)
```

## 🔧 Detección Automática

El código detecta automáticamente el entorno:

```javascript
// Desarrollo (localhost, 127.0.0.1, puerto 5173/3000)
baseURL = 'http://3.85.57.147:8080'

// Producción (cualquier otro dominio)
baseURL = '' // URLs relativas → proxy
```

## 📋 Características Implementadas

### ✅ Manejo Robusto
- **CORS completo**: Headers configurados correctamente
- **Todos los métodos**: GET, POST, PUT, DELETE, PATCH, OPTIONS
- **Headers preservados**: Authorization, Content-Type, etc.
- **Status codes**: Preserva códigos de respuesta del backend
- **Error handling**: Manejo específico de errores de conexión

### ✅ Compatibilidad
- **Status 204**: Convertido automáticamente a respuesta de éxito
- **Timeouts**: Configurados para conexiones lentas
- **Logging**: Trazabilidad completa de requests

### ✅ Fallbacks
- **Rewrite falla**: Función serverless toma el control
- **Parsing errors**: Manejo graceful de respuestas no-JSON
- **Network errors**: Mensajes claros para el usuario

## 🔍 Debug y Monitoring

### Console Logs
```javascript
🌐 API Configuration: {
  hostname: "ahorra-mas.vercel.app",
  protocol: "https:",
  strategy: "PROXY (relative URLs)"
}

🔄 Proxy request: POST /api/v1/auth/login
📥 Backend response: 204 No Content
```

### Verificación de Funcionamiento
1. **Desarrollo**: Ver requests directas a `http://3.85.57.147:8080`
2. **Producción**: Ver requests a `/api/*` en Network tab
3. **Vercel Functions**: Logs en dashboard de Vercel

## ⚠️ Consideraciones

### Backend Requirements
- ✅ **Sin cambios necesarios**: Backend sigue en HTTP
- ✅ **CORS**: Backend debe permitir origen de Vercel
- ✅ **Headers**: Backend debe aceptar Authorization headers

### Frontend Guarantees  
- ✅ **Sin Mixed Content**: Todo tráfico es HTTPS desde el navegador
- ✅ **Transparente**: Código de la app no cambia
- ✅ **Automático**: Detección de entorno sin configuración manual

## 🚨 Troubleshooting

### Si hay errores de conexión:
1. Verificar que `vercel.json` está en la raíz
2. Revisar logs en Vercel Dashboard → Functions
3. Verificar que backend acepta requests desde Vercel
4. Confirmar que rutas de API son correctas

### Para testing:
```bash
# Desarrollo normal
npm run dev

# Simular producción localmente
VITE_URL_API= npm run dev
```

## 📊 Estado Final
- 🟢 **Desarrollo**: HTTP directo (sin proxy)
- 🟢 **Producción**: HTTPS con proxy a HTTP
- 🟢 **Backend**: Sin cambios, permanece en HTTP
- 🟢 **Seguridad**: Sin Mixed Content warnings
- 🟢 **Performance**: Proxy transparente y eficiente
