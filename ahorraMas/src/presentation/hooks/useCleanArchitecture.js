import { useState, useEffect, useCallback } from 'react';
import container from '../../infrastructure/container.js';

/**
 * Función auxiliar para obtener el token de autenticación
 */
const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Función auxiliar para obtener el ID del usuario actual de forma segura
 */
const getCurrentUserId = () => {
  try {
    const userRepository = container.getRepository('user');
    return userRepository?.getCurrentUserId() || null;
  } catch (error) {
    console.warn('Error obteniendo ID del usuario actual:', error);
    return null;
  }
};

/**
 * Hook personalizado para integrar Clean Architecture con React
 * Proporciona acceso a casos de uso y manejo de estados
 */
export const useCleanArchitecture = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Casos de uso
  const userUseCases = container.getUserUseCases();
  const categoryUseCases = container.getCategoryUseCases();
  const transactionUseCases = container.getTransactionUseCases();
  const scheduleTransactionUseCases = container.getScheduleTransactionUseCases();
  const goalUseCases = container.getGoalUseCases();

  /**
   * Ejecuta un caso de uso con manejo de estado automático
   */
  const executeUseCase = useCallback(async (useCaseFunction, ...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await useCaseFunction(...args);
      return result;
    } catch (err) {
      console.error('Error executing use case:', err);
      setError(err.message || 'Error desconocido');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Limpia errores
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Estados
    loading,
    error,
    
    // Casos de uso
    userUseCases,
    categoryUseCases,
    transactionUseCases,
    scheduleTransactionUseCases,
    goalUseCases,
    
    // Utilidades
    executeUseCase,
    clearError
  };
};

/**
 * Hook específico para usuarios
 */
export const useUsers = () => {
  const { userUseCases, executeUseCase, loading, error, clearError } = useCleanArchitecture();
  const [user, setUser] = useState(null);

  const loadUser = useCallback(async (userId) => {
    try {
      const result = await executeUseCase(
        userUseCases.getProfile.bind(userUseCases),
        userId
      );
      setUser(result);
      return result;
    } catch (err) {
      console.error('Error loading user:', err);
      throw err;
    }
  }, [executeUseCase, userUseCases]);

  const loginUser = useCallback(async (credentials) => {
    try {
      const result = await executeUseCase(
        userUseCases.login.bind(userUseCases),
        credentials
      );
      if (result.user) {
        setUser(result.user);
      }
      return result;
    } catch (err) {
      console.error('Error logging in:', err);
      throw err;
    }
  }, [executeUseCase, userUseCases]);

  const registerUser = useCallback(async (userData) => {
    try {
      const result = await executeUseCase(
        userUseCases.register.bind(userUseCases),
        userData
      );
      return result;
    } catch (err) {
      console.error('Error registering user:', err);
      throw err;
    }
  }, [executeUseCase, userUseCases]);

  const updateUserProfile = useCallback(async (userId, updateData) => {
    try {
      const result = await executeUseCase(
        userUseCases.updateProfile.bind(userUseCases),
        userId,
        updateData
      );
      setUser(result);
      return result;
    } catch (err) {
      console.error('Error updating user profile:', err);
      throw err;
    }
  }, [executeUseCase, userUseCases]);

  // Cargar usuario del token al montar
  useEffect(() => {
    const loadCurrentUser = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          console.log('🔄 Cargando usuario con token:', token);
          const userRepository = container.getRepository('user');
          const currentUser = await userRepository.getCurrentUser();
          console.log('✅ Usuario cargado:', currentUser);
          if (currentUser) {
            setUser(currentUser);
          }
        } catch (error) {
          console.error('❌ Error cargando usuario actual:', error);
          setError(error.message);
        }
      } else {
        console.log('⚠️ No hay token de autenticación');
      }
    };
    
    loadCurrentUser();
  }, []);

  return {
    // Estados
    user,
    loading,
    error,
    
    // Acciones
    loadUser,
    loginUser,
    registerUser,
    updateUserProfile,
    clearError
  };
};

/**
 * Hook específico para transacciones
 */
export const useTransactions = () => {
  const { transactionUseCases, executeUseCase, loading, error, clearError } = useCleanArchitecture();
  const [transactions, setTransactions] = useState([]);
  const [statistics, setStatistics] = useState(null);

  const loadTransactions = useCallback(async (userId) => {
    try {
      const result = await executeUseCase(
        transactionUseCases.list.bind(transactionUseCases),
        userId
      );
      setTransactions(result);
      return result;
    } catch (err) {
      console.error('Error loading transactions:', err);
      throw err;
    }
  }, [executeUseCase, transactionUseCases]);

  const createTransaction = useCallback(async (transactionData) => {
    try {
      const result = await executeUseCase(
        transactionUseCases.create.bind(transactionUseCases),
        transactionData
      );
      // Refrescar lista después de crear
      if (transactionData.userId) {
        await loadTransactions(transactionData.userId);
      }
      return result;
    } catch (err) {
      console.error('Error creating transaction:', err);
      throw err;
    }
  }, [executeUseCase, transactionUseCases, loadTransactions]);

  const updateTransaction = useCallback(async (id, transactionData) => {
    try {
      const result = await executeUseCase(
        transactionUseCases.update.bind(transactionUseCases),
        transactionData.userId,
        id,
        transactionData
      );
      // Refrescar lista después de actualizar
      if (transactionData.userId) {
        await loadTransactions(transactionData.userId);
      }
      return result;
    } catch (err) {
      console.error('Error updating transaction:', err);
      throw err;
    }
  }, [executeUseCase, transactionUseCases, loadTransactions]);

  const deleteTransaction = useCallback(async (id, userId) => {
    try {
      const result = await executeUseCase(
        transactionUseCases.delete.bind(transactionUseCases),
        userId,
        id
      );
      // Refrescar lista después de eliminar
      if (userId) {
        await loadTransactions(userId);
      }
      return result;
    } catch (err) {
      console.error('Error deleting transaction:', err);
      throw err;
    }
  }, [executeUseCase, transactionUseCases, loadTransactions]);

  const loadStatistics = useCallback(async (userId) => {
    try {
      const result = await executeUseCase(
        transactionUseCases.getTransactionStatistics.bind(transactionUseCases),
        userId
      );
      setStatistics(result);
      return result;
    } catch (err) {
      console.error('Error loading statistics:', err);
      throw err;
    }
  }, [executeUseCase, transactionUseCases]);

  // Cargar transacciones automáticamente cuando haya usuario
  useEffect(() => {
    const loadUserTransactions = async () => {
      try {
        console.log('🔄 Iniciando carga de transacciones...');
        const userRepository = container.getRepository('user');
        const userId = await userRepository.getCurrentUserId();
        console.log('👤 ID de usuario obtenido:', userId);
        if (userId) {
          console.log('🔄 Cargando transacciones para usuario:', userId);
          const result = await loadTransactions(userId);
          console.log('✅ Transacciones cargadas exitosamente:', result?.length || 0);
        } else {
          console.log('⚠️ No se pudo obtener ID de usuario');
        }
      } catch (error) {
        console.error('❌ Error cargando transacciones automáticamente:', error);
      }
    };

    const token = localStorage.getItem('token');
    console.log('🔑 Token presente:', !!token);
    if (token) {
      loadUserTransactions();
    }
  }, [loadTransactions]);

  return {
    // Estados
    transactions,
    statistics,
    loading,
    error,
    
    // Acciones
    loadTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    loadStatistics,
    clearError
  };
};

/**
 * Hook específico para categorías
 */
export const useCategories = () => {
  const { categoryUseCases, executeUseCase, loading, error, clearError } = useCleanArchitecture();
  const [categories, setCategories] = useState([]);

  const loadCategories = useCallback(async (userId) => {
    try {
      const result = await executeUseCase(
        categoryUseCases.list.bind(categoryUseCases),
        userId
      );
      setCategories(result);
      return result;
    } catch (err) {
      console.error('Error loading categories:', err);
      throw err;
    }
  }, [executeUseCase, categoryUseCases]);

  const createCategory = useCallback(async (categoryData) => {
    try {
      const result = await executeUseCase(
        categoryUseCases.create.bind(categoryUseCases),
        categoryData
      );
      // Refrescar lista después de crear
      if (categoryData.userId) {
        await loadCategories(categoryData.userId);
      }
      return result;
    } catch (err) {
      console.error('Error creating category:', err);
      throw err;
    }
  }, [executeUseCase, categoryUseCases, loadCategories]);

  const updateCategory = useCallback(async (id, categoryData) => {
    try {
      const result = await executeUseCase(
        categoryUseCases.update.bind(categoryUseCases),
        categoryData.userId,
        id,
        categoryData
      );
      // Refrescar lista después de actualizar
      if (categoryData.userId) {
        await loadCategories(categoryData.userId);
      }
      return result;
    } catch (err) {
      console.error('Error updating category:', err);
      throw err;
    }
  }, [executeUseCase, categoryUseCases, loadCategories]);

  const deleteCategory = useCallback(async (id, userId) => {
    try {
      const result = await executeUseCase(
        categoryUseCases.delete.bind(categoryUseCases),
        userId,
        id
      );
      // Refrescar lista después de eliminar
      if (userId) {
        await loadCategories(userId);
      }
      return result;
    } catch (err) {
      console.error('Error deleting category:', err);
      throw err;
    }
  }, [executeUseCase, categoryUseCases, loadCategories]);

  // Cargar categorías automáticamente cuando haya usuario
  useEffect(() => {
    const loadUserCategories = async () => {
      try {
        console.log('🏷️ Iniciando carga de categorías...');
        const userRepository = container.getRepository('user');
        const userId = await userRepository.getCurrentUserId();
        console.log('👤 ID de usuario para categorías:', userId);
        if (userId) {
          console.log('🔄 Cargando categorías para usuario:', userId);
          const result = await loadCategories(userId);
          console.log('✅ Categorías cargadas exitosamente:', result?.length || 0);
        } else {
          console.log('⚠️ No se pudo obtener ID de usuario para categorías');
        }
      } catch (error) {
        console.error('❌ Error cargando categorías automáticamente:', error);
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      loadUserCategories();
    }
  }, [loadCategories]);

  return {
    // Estados
    categories,
    loading,
    error,
    
    // Acciones
    loadCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    clearError
  };
};

/**
 * Hook específico para transacciones programadas
 */
export const useScheduleTransactions = () => {
  const { scheduleTransactionUseCases, executeUseCase, loading, error, clearError } = useCleanArchitecture();
  const [scheduleTransactions, setScheduleTransactions] = useState([]);

  const loadScheduleTransactions = useCallback(async (userId) => {
    try {
      const result = await executeUseCase(
        scheduleTransactionUseCases.getScheduleTransactionsByUserId.bind(scheduleTransactionUseCases),
        userId
      );
      setScheduleTransactions(result);
      return result;
    } catch (err) {
      console.error('Error loading schedule transactions:', err);
      throw err;
    }
  }, [executeUseCase, scheduleTransactionUseCases]);

  const createScheduleTransaction = useCallback(async (scheduleTransactionData) => {
    try {
      const result = await executeUseCase(
        scheduleTransactionUseCases.createScheduleTransaction.bind(scheduleTransactionUseCases),
        scheduleTransactionData
      );
      // Refrescar lista después de crear
      const userId = getCurrentUserId();
      if (userId) {
        await loadScheduleTransactions(userId);
      }
      return result;
    } catch (err) {
      console.error('Error creating schedule transaction:', err);
      throw err;
    }
  }, [executeUseCase, scheduleTransactionUseCases, loadScheduleTransactions]);

  const updateScheduleTransaction = useCallback(async (scheduleTransactionId, updateData) => {
    try {
      const result = await executeUseCase(
        scheduleTransactionUseCases.updateScheduleTransaction.bind(scheduleTransactionUseCases),
        scheduleTransactionId,
        updateData
      );
      // Refrescar lista después de actualizar
      const userId = getCurrentUserId();
      if (userId) {
        await loadScheduleTransactions(userId);
      }
      return result;
    } catch (err) {
      console.error('Error updating schedule transaction:', err);
      throw err;
    }
  }, [executeUseCase, scheduleTransactionUseCases, loadScheduleTransactions]);

  const deleteScheduleTransaction = useCallback(async (scheduleTransactionId) => {
    try {
      const result = await executeUseCase(
        scheduleTransactionUseCases.deleteScheduleTransaction.bind(scheduleTransactionUseCases),
        scheduleTransactionId
      );
      // Refrescar lista después de eliminar
      const userId = getCurrentUserId();
      if (userId) {
        await loadScheduleTransactions(userId);
      }
      return result;
    } catch (err) {
      console.error('Error deleting schedule transaction:', err);
      throw err;
    }
  }, [executeUseCase, scheduleTransactionUseCases, loadScheduleTransactions]);

  // Cargar transacciones programadas automáticamente cuando haya usuario
  useEffect(() => {
    const loadUserScheduleTransactions = async () => {
      try {
        const userRepository = container.getRepository('user');
        const userId = await userRepository.getCurrentUserId();
        if (userId) {
          console.log('🔄 Cargando transacciones programadas para usuario:', userId);
          await loadScheduleTransactions(userId);
        }
      } catch (error) {
        console.error('❌ Error cargando transacciones programadas automáticamente:', error);
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      loadUserScheduleTransactions();
    }
  }, [loadScheduleTransactions]);

  return {
    // Estados
    scheduleTransactions,
    loading,
    error,
    
    // Acciones
    loadScheduleTransactions,
    createScheduleTransaction,
    updateScheduleTransaction,
    deleteScheduleTransaction,
    clearError
  };
};

/**
 * Hook específico para metas
 */
export const useGoals = () => {
  const { goalUseCases, executeUseCase, loading, error, clearError } = useCleanArchitecture();
  const [goals, setGoals] = useState([]);

  const loadGoals = useCallback(async (userId) => {
    try {
      const result = await executeUseCase(
        goalUseCases.getGoalsByUserId.bind(goalUseCases),
        userId
      );
      setGoals(result);
      return result;
    } catch (err) {
      console.error('Error loading goals:', err);
      throw err;
    }
  }, [executeUseCase, goalUseCases]);

  const createGoal = useCallback(async (goalData) => {
    try {
      const result = await executeUseCase(
        goalUseCases.createGoal.bind(goalUseCases),
        goalData
      );
      // Refrescar lista después de crear
      if (goalData.userId) {
        await loadGoals(goalData.userId);
      }
      return result;
    } catch (err) {
      console.error('Error creating goal:', err);
      throw err;
    }
  }, [executeUseCase, goalUseCases, loadGoals]);

  const completeGoal = useCallback(async (id, userId) => {
    try {
      const result = await executeUseCase(
        goalUseCases.completeGoal.bind(goalUseCases),
        id
      );
      // Refrescar lista después de completar
      if (userId) {
        await loadGoals(userId);
      }
      return result;
    } catch (err) {
      console.error('Error completing goal:', err);
      throw err;
    }
  }, [executeUseCase, goalUseCases, loadGoals]);

  const updateGoal = useCallback(async (goalId, goalData) => {
    try {
      const result = await executeUseCase(goalUseCases.updateGoal, { goalId, ...goalData });
      const userId = getCurrentUserId();
      
      // Refrescar lista después de actualizar
      if (userId) {
        await loadGoals(userId);
      }
      return result;
    } catch (err) {
      console.error('Error updating goal:', err);
      throw err;
    }
  }, [executeUseCase, goalUseCases, loadGoals]);

  const deleteGoal = useCallback(async (goalId) => {
    try {
      const result = await executeUseCase(goalUseCases.deleteGoal, { goalId });
      const userId = getCurrentUserId();
      
      // Refrescar lista después de eliminar
      if (userId) {
        await loadGoals(userId);
      }
      return result;
    } catch (err) {
      console.error('Error deleting goal:', err);
      throw err;
    }
  }, [executeUseCase, goalUseCases, loadGoals]);

  const getGoalById = useCallback(async (goalId) => {
    try {
      return await executeUseCase(goalUseCases.getGoalById, { goalId });
    } catch (err) {
      console.error('Error getting goal by ID:', err);
      throw err;
    }
  }, [executeUseCase, goalUseCases]);

  return {
    // Estados
    goals,
    loading,
    error,
    
    // Acciones
    loadGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    getGoalById,
    completeGoal,
    clearError
  };
};

// Custom hook para análisis financiero
export const useFinancialAnalysis = () => {
  const { transactions } = useTransactions();
  const { scheduleTransactions } = useScheduleTransactions();
  const { categories } = useCategories();
  
  // Calcular totales (memorizado para evitar cálculos innecesarios)
  const calculateTotals = useCallback(() => {
    console.log('🧮 Calculando totales con datos:', {
      transactions: transactions.length,
      scheduleTransactions: scheduleTransactions.length,
      categories: categories.length
    });
    
    const ingresos = transactions.filter(t => t.type === 'income');
    const egresos = transactions.filter(t => t.type === 'expense');
    const ingresosProgram = scheduleTransactions.filter(t => t.type === 'income' && t.status === true);
    const egresosProgram = scheduleTransactions.filter(t => t.type === 'expense' && t.status === true);
    
    console.log('📊 Datos filtrados:', {
      ingresos: ingresos.length,
      egresos: egresos.length,
      ingresosProgram: ingresosProgram.length,
      egresosProgram: egresosProgram.length,
      ingresosDetalle: ingresos.map(t => ({ desc: t.description, amount: t.amount, type: t.type })),
      egresosDetalle: egresos.map(t => ({ desc: t.description, amount: t.amount, type: t.type, regularity: t.regularity })),
      ingresosProgramDetalle: ingresosProgram.map(t => ({ desc: t.description, amount: t.amount, type: t.type, regularity: t.regularity, status: t.status })),
      egresosProgramDetalle: egresosProgram.map(t => ({ desc: t.description, amount: t.amount, type: t.type, regularity: t.regularity, status: t.status }))
    });
    
    const ingresoRegular = ingresos.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const ingresoProgramado = ingresosProgram.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const ingresoTotal = ingresoRegular + ingresoProgramado;
    
    console.log('💰 Cálculo de ingresos:', {
      ingresoRegular,
      ingresoProgramado,
      ingresoTotal
    });
    // Calcular gastos fijos (incluyendo ahorro si está marcado como static)
    const gastosFijos = egresos.filter(t => t.regularity === 'static');
    const gastosFijosProgram = egresosProgram.filter(t => t.regularity === 'static');
    
    const gastoFijoRegular = gastosFijos.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const gastoFijoProgramado = gastosFijosProgram.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const gastoFijoTotal = gastoFijoRegular + gastoFijoProgramado;
    
    console.log('🏠 Cálculo de gastos fijos:', {
      gastoFijoRegular,
      gastoFijoProgramado,
      gastoFijoTotal,
      gastosFijosProgram: gastosFijosProgram.map(t => ({
        id: t.id,
        amount: t.amount,
        description: t.description,
        regularity: t.regularity,
        status: t.status
      }))
    });
    
    // Calcular gastos variables
    const gastoVariableTotal = egresos.filter(t => t.regularity === 'variable').reduce((sum, t) => sum + parseFloat(t.amount), 0) +
                              egresosProgram.filter(t => t.regularity === 'variable').reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    // Buscar ahorro específicamente en las transacciones (puede ser categoría de ahorro)
    const ahorroTransacciones = [...egresos, ...egresosProgram].filter(t => 
      t.description?.toLowerCase().includes('ahorro') || 
      categories.find(cat => cat.id === t.categoryId)?.name?.toLowerCase().includes('ahorro')
    );
    const ahorro = ahorroTransacciones.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    // Calcular sobrante: Ingresos - Gastos Fijos - Ahorro
    const sobranteParaGastar = ingresoTotal - gastoFijoTotal - ahorro;
    const diasRestantes = 10; // Calcular según fecha actual
    const tieneIngresoVariable = [...ingresos, ...ingresosProgram].some(t => t.regularity === 'variable');
    
    const resultado = {
      ingresoTotal,
      gastoFijoTotal,
      gastoVariableTotal,
      ahorro,
      sobranteParaGastar,
      diasRestantes,
      tieneIngresoVariable
    };
    
    console.log('💰 Totales calculados:', resultado);
    console.log('🔍 Detalles de cálculo:', {
      'Ingresos totales': ingresoTotal,
      'Gastos fijos': gastoFijoTotal,
      'Gastos variables': gastoVariableTotal,
      'Ahorro identificado': ahorro,
      'Fórmula sobrante': `${ingresoTotal} - ${gastoFijoTotal} - ${ahorro} = ${sobranteParaGastar}`,
      'Transacciones de ahorro': ahorroTransacciones.map(t => ({ desc: t.description, amount: t.amount }))
    });
    return resultado;
  }, [transactions, scheduleTransactions, categories]);
  
  // Calcular estadísticas mensuales
  const calculateMonthlyStats = () => {
    const meses = {};
    
    // Procesar transacciones históricas
    transactions.forEach(transaction => {
      const fecha = new Date(transaction.createdAt);
      const mesKey = fecha.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
      
      if (!meses[mesKey]) {
        meses[mesKey] = { mes: mesKey, ingreso: 0, gasto: 0 };
      }
      
      if (transaction.type === 'income') {
        meses[mesKey].ingreso += parseFloat(transaction.amount);
      } else if (transaction.type === 'expense') {
        meses[mesKey].gasto += parseFloat(transaction.amount);
      }
    });
    
    // Añadir transacciones programadas para el mes actual
    const mesActual = new Date().toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
    if (!meses[mesActual]) {
      meses[mesActual] = { mes: mesActual, ingreso: 0, gasto: 0 };
    }
    
    scheduleTransactions.forEach(schedule => {
      if (schedule.status) {
        if (schedule.type === 'income') {
          meses[mesActual].ingreso += parseFloat(schedule.amount);
        } else if (schedule.type === 'expense') {
          meses[mesActual].gasto += parseFloat(schedule.amount);
        }
      }
    });
    
    return Object.values(meses).slice(-3); // Últimos 3 meses
  };
  
  // Obtener transacciones con nombres de categorías
  const getTransactionsWithCategories = (type = null, regularity = null) => {
    let filteredTransactions = transactions;
    
    if (type) {
      filteredTransactions = filteredTransactions.filter(t => t.type === type);
    }
    
    if (regularity) {
      filteredTransactions = filteredTransactions.filter(t => t.regularity === regularity);
    }
    
    return filteredTransactions.map(transaction => {
      const categoria = categories.find(cat => cat.id === transaction.categoryId);
      return {
        ...transaction,
        categoryName: categoria ? categoria.name : 'Sin categoría'
      };
    });
  };
  
  return {
    calculateTotals,
    calculateMonthlyStats,
    getTransactionsWithCategories
  };
};
