// Función serverless para actuar como proxy a la API HTTP
export default async function handler(req, res) {
  const { method, body, query } = req;
  const { path } = query;
  
  // Configurar CORS headers primero
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Manejar preflight OPTIONS
  if (method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Construir la URL del backend
  const backendURL = 'http://3.85.57.147:8080';
  const apiPath = Array.isArray(path) ? path.join('/') : (path || '');
  const targetURL = `${backendURL}/api/${apiPath}`;
  
  console.log(`🔄 Proxy request: ${method} ${targetURL}`);
  
  try {
    // Construir headers para la request
    const headers = {};
    
    // Copiar headers importantes del request original
    if (req.headers['content-type']) {
      headers['Content-Type'] = req.headers['content-type'];
    }
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization;
    }
    if (req.headers['x-requested-with']) {
      headers['X-Requested-With'] = req.headers['x-requested-with'];
    }
    
    // Preparar el body
    let requestBody = undefined;
    if (method !== 'GET' && method !== 'HEAD' && body) {
      requestBody = typeof body === 'string' ? body : JSON.stringify(body);
    }
    
    console.log('📤 Request headers:', headers);
    console.log('📤 Request body:', requestBody);
    
    // Hacer request al backend
    const response = await fetch(targetURL, {
      method: method,
      headers: headers,
      body: requestBody,
    });
    
    console.log(`📥 Backend response: ${response.status} ${response.statusText}`);
    
    // Obtener la respuesta
    let data;
    const contentType = response.headers.get('content-type');
    
    try {
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        // Si el texto está vacío y es 204, crear respuesta apropiada según el endpoint
        if (response.status === 204 && !text) {
          // Para endpoints GET que deberían retornar listas (categorías, transacciones, etc.)
          if (method === 'GET') {
            if (apiPath.includes('category')) {
              console.log('🏷️ GET categories returned 204, sending empty array');
              data = [];
            } else if (apiPath.includes('transaction') || apiPath.includes('goal') || apiPath.includes('schedule')) {
              console.log('📋 GET list returned 204, sending empty array');
              data = [];
            } else {
              console.log('📄 GET returned 204, sending empty object');
              data = {};
            }
          } else {
            // Para POST, PUT, DELETE mantener respuesta de éxito
            console.log('✅ Operation successful (204)');
            data = { success: true, message: 'Operación exitosa' };
          }
        } else {
          data = text;
        }
      }
    } catch (parseError) {
      console.log('⚠️ Could not parse response as JSON, using as text');
      data = { success: response.ok, status: response.status };
    }
    
    // Para responses 204 con datos, cambiar status a 200 para que el frontend lo procese correctamente
    const statusCode = (response.status === 204 && data && (Array.isArray(data) || typeof data === 'object')) ? 200 : response.status;
    
    console.log(`📤 Sending response: ${statusCode}`, data);
    return res.status(statusCode).json(data);
    
  } catch (error) {
    console.error('❌ Proxy error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Error de conexión con el servidor',
      message: error.message,
      details: 'El servidor backend no está disponible o hay problemas de conectividad'
    });
  }
}
