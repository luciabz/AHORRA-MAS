export default async function handler(req, res) {
  const { method, body, query } = req;
  const { path } = query;
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const backendURL = 'http://3.85.57.147:8080';
  const apiPath = Array.isArray(path) ? path.join('/') : (path || '');
  const targetURL = `${backendURL}/api/${apiPath}`;
  
  
  try {
    const headers = {};
    
    if (req.headers['content-type']) {
      headers['Content-Type'] = req.headers['content-type'];
    }
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization;
    }
    if (req.headers['x-requested-with']) {
      headers['X-Requested-With'] = req.headers['x-requested-with'];
    }
    
    let requestBody = undefined;
    if (method !== 'GET' && method !== 'HEAD' && body) {
      requestBody = typeof body === 'string' ? body : JSON.stringify(body);
    }
    
    
    const response = await fetch(targetURL, {
      method: method,
      headers: headers,
      body: requestBody,
    });
    
    
    let data;
    const contentType = response.headers.get('content-type');
    
    try {
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        if (response.status === 204 && !text) {
          if (method === 'GET') {
            if (apiPath.includes('category')) {
              data = [];
            } else if (apiPath.includes('transaction') || apiPath.includes('goal') || apiPath.includes('schedule')) {
              data = [];
            } else {
              data = {};
            }
          } else {
            data = { success: true, message: 'Operación exitosa' };
          }
        } else {
          data = text;
        }
      }
    } catch (parseError) {
      data = { success: response.ok, status: response.status };
    }
    
    const statusCode = (response.status === 204 && data && (Array.isArray(data) || typeof data === 'object')) ? 200 : response.status;
    
    if (response.status === 204 && method === 'POST' && apiPath.includes('category')) {
      try {
        // Recargar la lista de categorías para devolver la categoría creada
        const getResponse = await fetch(`${backendURL}/api/${apiPath.split('/')[0]}/category`, {
          method: 'GET',
          headers: {
            'Authorization': headers['Authorization'],
            'Content-Type': 'application/json'
          }
        });
        
        if (getResponse.ok) {
          const getContentType = getResponse.headers.get('content-type');
          let categories = [];
          
          if (getContentType && getContentType.includes('application/json')) {
            const responseData = await getResponse.json();
            categories = Array.isArray(responseData) ? responseData : responseData.data || [];
          }
          
          // Devolver la última categoría creada (asumiendo que es la más reciente)
          if (categories.length > 0) {
            const newCategory = categories[categories.length - 1];
            return res.status(200).json({
              success: true,
              data: newCategory,
              message: 'Categoría creada exitosamente'
            });
          }
        }
      } catch (reloadError) {
        console.log('⚠️ Could not reload categories after creation');
      }
    }
    
    return res.status(statusCode).json(data);
    
  } catch (error) {
    return res.status(500).json({ 
      success: false,
      error: 'Error de conexión con el servidor',
      message: error.message,
      details: 'El servidor backend no está disponible o hay problemas de conectividad'
    });
  }
}
