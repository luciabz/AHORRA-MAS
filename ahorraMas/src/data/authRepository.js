import axiosInstance from '../infrastructure/api/axiosInstance';

export const authRepository = {
  login: async ({ name, password }) => {
    console.log('🚀 Making login request with:', { name, password });
    
    try {
      const response = await axiosInstance.post('/api/v1/auth/login', { name, password });
      
      // Debug: ver la respuesta completa
      console.log('✅ Login response received:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers
      });
      
      // Buscar token en todos los lugares posibles
      const tokenFromData = response.data?.token || response.data?.accessToken || response.data?.access_token;
      const tokenFromHeaders = response.headers['authorization'] || 
                             response.headers['Authorization'] ||
                             response.headers['x-auth-token'] ||
                             response.headers['x-access-token'] ||
                             response.headers['token'];
      
      const token = tokenFromData || tokenFromHeaders;
      
      console.log('🔑 Token found:', {
        fromData: tokenFromData,
        fromHeaders: tokenFromHeaders,
        finalToken: token
      });
      
      // Si es 204 o tenemos token, construir respuesta exitosa
      if (response.status === 204 || token) {
        return {
          success: true,
          token: token,
          user: response.data?.user || { name: name },
          message: 'Login exitoso'
        };
      }
      
      return response.data;
      
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('❌ Error response:', error.response?.data);
      throw error;
    }
  },
  register: async ({ name, email, password }) => {
    const response = await axiosInstance.post('/api/v1/auth/register', { name, email, password });
    return response.data;
  },
  me: async () => {
    const response = await axiosInstance.get('/api/v1/auth/me');
    return response.data;
  }
};

