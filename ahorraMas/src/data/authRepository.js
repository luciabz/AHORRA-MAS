import axiosInstance from '../infrastructure/api/axiosInstance';

export const authRepository = {
  login: async ({ name, password }) => {
    
    try {
      const response = await axiosInstance.post('/api/v1/auth/login', { name, password });
     
      
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
    console.log('🚀 Making register request with:', { name, email, password });
    
    try {
      const response = await axiosInstance.post('/api/v1/auth/register', { 
        name, 
        email, 
        password 
      });
      
      // Debug: ver la respuesta completa
      console.log('✅ Register response received:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers
      });
      
      // Manejar tanto 201 (Created) como 204 (No Content) como exitosos
      if (response.status === 201 || response.status === 204) {
        return {
          success: true,
          message: 'Usuario registrado exitosamente',
          user: response.data?.user || { name, email },
          data: response.data
        };
      }
      
      // Si hay data, devolverla tal como está
      return response.data || {
        success: true,
        message: 'Usuario registrado exitosamente'
      };
      
    } catch (error) {
      console.error('❌ Register error:', error);
      console.error('❌ Error response:', error.response?.data);
      
      // Si es un error de validación o conflicto, extraer el mensaje
      if (error.response?.status === 400 || error.response?.status === 409) {
        throw new Error(error.response.data?.message || 'Error en el registro');
      }
      
      throw error;
    }
  },
  me: async () => {
    const response = await axiosInstance.get('/api/v1/auth/me');
    return response.data;
  }
};

