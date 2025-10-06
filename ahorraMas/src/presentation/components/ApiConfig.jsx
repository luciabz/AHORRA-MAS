import React from 'react';
import { useApiErrorHandler } from '../hooks';

/**
 * Componente que configura los interceptors y manejo de errores de la API
 */
const ApiConfig = ({ children }) => {
  useApiErrorHandler();

  return <>{children}</>;
};

export default ApiConfig;
