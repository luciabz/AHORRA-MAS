import { useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from '../contexts';

export const useApiErrorHandler = () => {
  const { logout } = useAuthContext();

  useEffect(() => {
    // Interceptor para manejar errores de respuesta
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token inválido o expirado
          logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [logout]);
};
