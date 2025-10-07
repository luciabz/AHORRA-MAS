import { useState, useCallback } from 'react';
import { authRepository } from '../../data/authRepository';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para obtener el usuario actual del localStorage
  const getCurrentUser = useCallback(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        return JSON.parse(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        return null;
      }
    }
    return null;
  }, []);

  // Verificar si el usuario está autenticado
  const isAuthenticated = useCallback(() => {
    const token = localStorage.getItem('token');
    const userData = getCurrentUser();
    return !!(token && userData);
  }, [getCurrentUser]);

  // Función de login
  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔑 useAuth: Received credentials:', credentials);
      
      // Usar los datos tal como llegan del formulario
      const loginData = {
        name: credentials.name, // Usar el name que viene del formulario
        password: credentials.password
      };
      
      console.log('🔑 useAuth: Sending loginData:', loginData);
      
      const response = await authRepository.login(loginData);
      
      // Debug: Log para ver la estructura de la respuesta
      console.log('🔐 Login response:', response);
      
      // Manejar diferentes estructuras de respuesta de la API
      const token = response.token || response.accessToken || response.access_token;
      const user = response.user || response.data?.user || response;
      
      // Si response está vacío pero no hay error, asumir éxito (caso 204)
      const success = response.success !== undefined ? response.success : 
                     (response.status === 204 || !!token || 
                      (response && Object.keys(response).length === 0));
      
      if (success) {
        // Si tenemos token, guardarlo
        if (token) {
          console.log('💾 Saving token:', token);
          localStorage.setItem('token', token);
        } else {
          console.warn('⚠️ Login successful but no token received');
        }
        
        // Guardar usuario si existe
        if (user && typeof user === 'object') {
          localStorage.setItem('user', JSON.stringify(user));
          setUser(user);
        } else {
          // Crear usuario básico con el name usado
          const basicUser = { name: credentials.name };
          localStorage.setItem('user', JSON.stringify(basicUser));
          setUser(basicUser);
        }
        
        return {
          success: true,
          message: 'Login exitoso',
          user: user,
          token: token
        };
      } else {
        const message = response.message || response.error || 'Error en el login';
        setError(message);
        return {
          success: false,
          message
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || error.message || 'Error de conexión';
      setError(message);
      return {
        success: false,
        message
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Función de registro
  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔑 useAuth: Registering user with:', userData);
      
      const response = await authRepository.register(userData);
      
      console.log('📝 Register response:', response);
      
      // Verificar éxito: explícito success=true o respuesta exitosa implícita
      const isSuccess = response.success === true || 
                       (response.success !== false && response); // Si no es explícitamente false y hay respuesta
      
      if (isSuccess) {
        // Si el registro es exitoso, prepara los datos del usuario
        const user = response.user || { 
          name: userData.name, 
          email: userData.email 
        };
        
        // Si viene token, guardarlo (opcional para registro)
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(user));
          setUser(user);
        }
        
        return {
          success: true,
          message: response.message || 'Usuario registrado exitosamente',
          user: user,
          token: response.token
        };
      } else {
        const errorMessage = response.message || 'Error en el registro';
        setError(errorMessage);
        return {
          success: false,
          message: errorMessage
        };
      }
    } catch (error) {
      console.error('❌ Register error:', error);
      
      // Extraer mensaje de error más específico
      let errorMessage = 'Error de conexión';
      
      if (error.response?.data) {
        errorMessage = error.response.data.message || 
                      error.response.data.error || 
                      'Error del servidor';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Función de logout
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
  }, []);

  // Función para obtener datos del usuario desde la API
  const fetchUserData = useCallback(async () => {
    if (!isAuthenticated()) return null;
    
    setLoading(true);
    try {
      const response = await authRepository.me();
      if (response.success) {
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
        return response.user;
      }
    } catch (error) {
      console.error('Fetch user data error:', error);
      // Si hay error de autenticación, hacer logout
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, logout]);

  // Inicializar usuario desde localStorage
  const initializeAuth = useCallback(() => {
    const userData = getCurrentUser();
    if (userData) {
      setUser(userData);
    }
  }, [getCurrentUser]);

  return {
    user: user || getCurrentUser(),
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
    fetchUserData,
    initializeAuth
  };
};
