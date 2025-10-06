import React, { createContext, useContext, useEffect } from 'react';
import { useAuth } from '../hooks';

const AuthContext = createContext();

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const auth = useAuth();

  useEffect(() => {
    // Inicializar autenticación al cargar la aplicación
    auth.initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};
