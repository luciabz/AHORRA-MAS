import { useState, useEffect, useCallback } from 'react';
import { 
  getTransactions, 
  createTransaction, 
  updateTransaction, 
  deleteTransaction, 
  getTransactionById 
} from '../../data/transactionRepository';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar todas las transacciones
  const loadTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getTransactions();
      
      // Manejar diferentes estructuras de respuesta
      if (response.success !== undefined) {
        // API devuelve {success, data, message}
        if (response.success) {
          setTransactions(response.data || []);
        } else {
          setError(response.message || 'Error al cargar transacciones');
        }
      } else if (Array.isArray(response)) {
        // API devuelve directamente un array
        setTransactions(response);
      } else if (response.data && Array.isArray(response.data)) {
        // API devuelve {data: [...]}
        setTransactions(response.data);
      } else {
        // Asumir que la respuesta directa son los datos
        setTransactions(response || []);
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear una nueva transacción
  const addTransaction = useCallback(async (transactionData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await createTransaction(transactionData);
      if (response.success) {
        setTransactions(prev => [...prev, response.data]);
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Error al crear transacción');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Error de conexión';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar una transacción existente
  const editTransaction = useCallback(async (id, transactionData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await updateTransaction(id, transactionData);
      if (response.success) {
        setTransactions(prev => 
          prev.map(transaction => 
            transaction.id === id ? response.data : transaction
          )
        );
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Error al actualizar transacción');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Error de conexión';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Eliminar una transacción
  const removeTransaction = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await deleteTransaction(id);
      if (response.success) {
        setTransactions(prev => prev.filter(transaction => transaction.id !== id));
        return { success: true };
      } else {
        setError(response.message || 'Error al eliminar transacción');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Error de conexión';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener una transacción por ID
  const getTransaction = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getTransactionById(id);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Error al obtener transacción');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Error de conexión';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Filtrar transacciones por tipo (ingreso/gasto)
  const getTransactionsByType = useCallback((type) => {
    return transactions.filter(transaction => transaction.type === type);
  }, [transactions]);

  // Filtrar transacciones por categoría
  const getTransactionsByCategory = useCallback((categoryId) => {
    return transactions.filter(transaction => transaction.categoryId === categoryId);
  }, [transactions]);

  // Filtrar transacciones por mes
  const getTransactionsByMonth = useCallback((month, year) => {
    const filtered = transactions.filter(transaction => {
      // Usar createdAt en lugar de date
      const dateField = transaction.date || transaction.createdAt;
      const transactionDate = new Date(dateField);
      const transMonth = transactionDate.getMonth();
      const transYear = transactionDate.getFullYear();
      
      return transMonth === month && transYear === year;
    });
    
    return filtered;
  }, [transactions]);

  // Calcular totales
  const getTotals = useCallback((filterTransactions = transactions) => {
    return filterTransactions.reduce(
      (totals, transaction) => {
        const amount = parseFloat(transaction.amount) || 0;
        if (transaction.type === 'income') {
          totals.income += amount;
        } else {
          totals.expense += amount;
        }
        totals.balance = totals.income - totals.expense;
        return totals;
      },
      { income: 0, expense: 0, balance: 0 }
    );
  }, [transactions]);

  // Cargar transacciones al montar el componente
  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return {
    transactions,
    loading,
    error,
    loadTransactions,
    addTransaction,
    editTransaction,
    removeTransaction,
    getTransaction,
    getTransactionsByType,
    getTransactionsByCategory,
    getTransactionsByMonth,
    getTotals
  };
};
