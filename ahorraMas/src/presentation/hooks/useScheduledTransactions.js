import { useState, useEffect, useCallback } from 'react';
import { 
  getScheduleTransaction, 
  createScheduleTransaction, 
  updateScheduleTransaction, 
  deleteScheduleTransaction, 
  getScheduleTransactionById 
} from '../../data/scheduleRepository';

export const useScheduledTransactions = () => {
  const [scheduledTransactions, setScheduledTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar todas las transacciones programadas
  const loadScheduledTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getScheduleTransaction();
      console.log('📅 Scheduled transactions response:', response);
      
      // Manejar diferentes estructuras de respuesta
      if (response.success !== undefined) {
        // API devuelve {success, data, message}
        if (response.success) {
          setScheduledTransactions(response.data || []);
        } else {
          setError(response.message || 'Error al cargar transacciones programadas');
        }
      } else if (Array.isArray(response)) {
        // API devuelve directamente un array
        setScheduledTransactions(response);
      } else if (response.data && Array.isArray(response.data)) {
        // API devuelve {data: [...]}
        setScheduledTransactions(response.data);
      } else {
        // Asumir que la respuesta directa son los datos
        setScheduledTransactions(response || []);
      }
    } catch (error) {
      console.error('Load scheduled transactions error:', error);
      setError(error.response?.data?.message || error.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear una nueva transacción programada
  const addScheduledTransaction = useCallback(async (transactionData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await createScheduleTransaction(transactionData);
      console.log('🔍 Response completa de createScheduleTransaction:', response);
      
      // Verificar si la respuesta tiene la estructura esperada
      if (response && response.success !== undefined) {
        // API devuelve {success, data, message}
        if (response.success) {
          setScheduledTransactions(prev => [...prev, response.data]);
          return { success: true, data: response.data };
        } else {
          setError(response.message || 'Error al crear transacción programada');
          return { success: false, message: response.message };
        }
      } else {
        // La API podría estar devolviendo directamente el objeto creado
        // Asumir éxito si tenemos datos
        if (response && (response.id || response._id)) {
          setScheduledTransactions(prev => [...prev, response]);
          return { success: true, data: response };
        } else {
          console.log('🔍 Respuesta inesperada de scheduled:', response);
          setError('Respuesta del servidor no reconocida');
          return { success: false, message: 'Respuesta del servidor no reconocida' };
        }
      }
    } catch (error) {
      console.error('Create scheduled transaction error:', error);
      const message = error.response?.data?.message || error.message || 'Error de conexión';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar una transacción programada existente
  const editScheduledTransaction = useCallback(async (id, transactionData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await updateScheduleTransaction(id, transactionData);
      
      // Verificar si la respuesta tiene la estructura esperada
      if (response && response.success !== undefined) {
        // API devuelve {success, data, message}
        if (response.success) {
          setScheduledTransactions(prev => 
            prev.map(transaction => 
              transaction.id === id ? response.data : transaction
            )
          );
          return { success: true, data: response.data };
        } else {
          setError(response.message || 'Error al actualizar transacción programada');
          return { success: false, message: response.message };
        }
      } else {
        // La API podría estar devolviendo directamente el objeto actualizado
        if (response && (response.id || response._id)) {
          setScheduledTransactions(prev => 
            prev.map(transaction => 
              transaction.id === id ? response : transaction
            )
          );
          return { success: true, data: response };
        } else {
          setError('Respuesta del servidor no reconocida');
          return { success: false, message: 'Respuesta del servidor no reconocida' };
        }
      }
    } catch (error) {
      console.error('Update scheduled transaction error:', error);
      const message = error.response?.data?.message || error.message || 'Error de conexión';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Eliminar una transacción programada
  const removeScheduledTransaction = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await deleteScheduleTransaction(id);
      if (response.success) {
        setScheduledTransactions(prev => prev.filter(transaction => transaction.id !== id));
        return { success: true };
      } else {
        setError(response.message || 'Error al eliminar transacción programada');
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Delete scheduled transaction error:', error);
      const message = error.response?.data?.message || error.message || 'Error de conexión';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener una transacción programada por ID
  const getScheduledTransaction = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getScheduleTransactionById(id);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Error al obtener transacción programada');
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Get scheduled transaction error:', error);
      const message = error.response?.data?.message || error.message || 'Error de conexión';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Filtrar por tipo de frecuencia
  const getScheduledTransactionsByFrequency = useCallback((frequency) => {
    return scheduledTransactions.filter(transaction => transaction.frequency === frequency);
  }, [scheduledTransactions]);

  // Obtener próximas transacciones (dentro de los próximos 7 días)
  const getUpcomingTransactions = useCallback((days = 7) => {
    const now = new Date();
    const future = new Date();
    future.setDate(now.getDate() + days);

    return scheduledTransactions.filter(transaction => {
      const nextDate = new Date(transaction.nextExecution);
      return nextDate >= now && nextDate <= future;
    });
  }, [scheduledTransactions]);

  // Obtener transacciones programadas activas
  const getActiveScheduledTransactions = useCallback(() => {
    return scheduledTransactions.filter(transaction => transaction.isActive !== false);
  }, [scheduledTransactions]);

  // Cargar transacciones programadas al montar el componente
  useEffect(() => {
    loadScheduledTransactions();
  }, [loadScheduledTransactions]);

  return {
    scheduledTransactions,
    loading,
    error,
    loadScheduledTransactions,
    addScheduledTransaction,
    editScheduledTransaction,
    removeScheduledTransaction,
    getScheduledTransaction,
    getScheduledTransactionsByFrequency,
    getUpcomingTransactions,
    getActiveScheduledTransactions
  };
};
