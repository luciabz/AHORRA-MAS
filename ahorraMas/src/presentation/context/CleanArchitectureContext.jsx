import React, { createContext, useContext, useEffect, useState } from 'react';
import container from '../../infrastructure/container.js';

const CleanArchitectureContext = createContext();

/**
 * Provider que inicializa Clean Architecture y provee acceso global
 */
export const CleanArchitectureProvider = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeCleanArchitecture();
  }, []);

  const initializeCleanArchitecture = async () => {
    try {
      // Inicializar container
      container.init();
      
      // Cargar usuario actual si hay token
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userUseCases = container.getUserUseCases();
          const user = await userUseCases.getCurrentUser();
          setCurrentUser(user);
        } catch (error) {
          console.warn('No se pudo cargar el usuario actual:', error);
          // Token inválido, limpiar
          localStorage.removeItem('token');
        }
      }
      
      setInitialized(true);
    } catch (error) {
      console.error('Error inicializando Clean Architecture:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (user, token) => {
    localStorage.setItem('token', token);
    setCurrentUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    container.reset();
    container.init();
  };

  const value = {
    initialized,
    currentUser,
    loading,
    login,
    logout,
    // Acceso directo a casos de uso
    userUseCases: container.getUserUseCases(),
    categoryUseCases: container.getCategoryUseCases(),
    transactionUseCases: container.getTransactionUseCases(),
    scheduleTransactionUseCases: container.getScheduleTransactionUseCases(),
    goalUseCases: container.getGoalUseCases()
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <CleanArchitectureContext.Provider value={value}>
      {children}
    </CleanArchitectureContext.Provider>
  );
};

/**
 * Hook para usar el contexto de Clean Architecture
 */
export const useCleanArchitectureContext = () => {
  const context = useContext(CleanArchitectureContext);
  if (!context) {
    throw new Error('useCleanArchitectureContext debe usarse dentro de CleanArchitectureProvider');
  }
  return context;
};
