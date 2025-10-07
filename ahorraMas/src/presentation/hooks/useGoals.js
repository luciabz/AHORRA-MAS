import { useState, useEffect, useCallback } from 'react';
import { 
  getGoal, 
  createGoal, 
  updateGoal, 
  deleteGoal, 
  getGoalById 
} from '../../data/goalsRepository';

export const useGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar todas las metas
  const loadGoals = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Debug: verificar token antes de hacer la llamada
      const token = localStorage.getItem('token');
      if (token) {
      }
      
      const response = await getGoal();
      
      // Manejar diferentes estructuras de respuesta
      if (response === null || response === undefined) {
        // No hay respuesta, usar array vacío
        setGoals([]);
      } else if (response.success !== undefined) {
        // API devuelve {success, data, message}
        if (response.success) {
          setGoals(response.data || []);
        } else {
          console.warn('Goals API returned success: false:', response.message);
          setGoals([]); // En lugar de error, usar array vacío
        }
      } else if (Array.isArray(response)) {
        // API devuelve directamente un array
        setGoals(response);
      } else if (response.data && Array.isArray(response.data)) {
        // API devuelve {data: [...]}
        setGoals(response.data);
      } else {
        // Asumir que la respuesta directa son los datos
        setGoals(response || []);
      }
    } catch (error) {
      
      // Si el endpoint no existe, simplemente usar datos vacíos en lugar de mostrar error
      if (error.response?.status === 401 || error.response?.status === 404) {
        console.warn('Goals endpoint not available or unauthorized, using empty array');
        setGoals([]);
        setError(null); // No mostrar error al usuario
      } else {
        setError(error.response?.data?.message || error.message || 'Error de conexión');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear una nueva meta
  const addGoal = useCallback(async (goalData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await createGoal(goalData);
      
      // Verificar si la respuesta tiene la estructura esperada
      if (response && response.success !== undefined) {
        // API devuelve {success, data, message}
        if (response.success) {
          setGoals(prev => [...prev, response.data]);
          return { success: true, data: response.data };
        } else {
          setError(response.message || 'Error al crear meta');
          return { success: false, message: response.message };
        }
      } else {
        // La API podría estar devolviendo directamente el objeto creado
        // Asumir éxito si tenemos datos
        if (response && (response.id || response._id)) {
          setGoals(prev => [...prev, response]);
          return { success: true, data: response };
        } else {
          setError('Respuesta del servidor no reconocida');
          return { success: false, message: 'Respuesta del servidor no reconocida' };
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Error de conexión';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar una meta existente
  const editGoal = useCallback(async (id, goalData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await updateGoal(id, goalData);
      
      // Verificar si la respuesta tiene la estructura esperada
      if (response && response.success !== undefined) {
        // API devuelve {success, data, message}
        if (response.success) {
          setGoals(prev => 
            prev.map(goal => 
              goal.id === id ? response.data : goal
            )
          );
          return { success: true, data: response.data };
        } else {
          setError(response.message || 'Error al actualizar meta');
          return { success: false, message: response.message };
        }
      } else {
        // La API podría estar devolviendo directamente el objeto actualizado
        if (response && (response.id || response._id)) {
          setGoals(prev => 
            prev.map(goal => 
              goal.id === id ? response : goal
            )
          );
          return { success: true, data: response };
        } else {
          setError('Respuesta del servidor no reconocida');
          return { success: false, message: 'Respuesta del servidor no reconocida' };
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Error de conexión';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Eliminar una meta
  const removeGoal = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await deleteGoal(id);
      
      // Verificar si la respuesta tiene la estructura esperada
      if (response && response.success !== undefined) {
        // API devuelve {success, data, message}
        if (response.success) {
          setGoals(prev => prev.filter(goal => goal.id !== id));
          return { success: true };
        } else {
          setError(response.message || 'Error al eliminar meta');
          return { success: false, message: response.message };
        }
      } else {
        // Para eliminación, una respuesta vacía o con status 200 es éxito
        // O si devuelve el objeto eliminado
        setGoals(prev => prev.filter(goal => goal.id !== id));
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Error de conexión';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener una meta por ID
  const getGoalDetails = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getGoalById(id);
      
      // Verificar si la respuesta tiene la estructura esperada
      if (response && response.success !== undefined) {
        // API devuelve {success, data, message}
        if (response.success) {
          return { success: true, data: response.data };
        } else {
          setError(response.message || 'Error al obtener meta');
          return { success: false, message: response.message };
        }
      } else {
        // La API podría estar devolviendo directamente el objeto
        if (response && (response.id || response._id)) {
          return { success: true, data: response };
        } else {
          setError('Respuesta del servidor no reconocida');
          return { success: false, message: 'Respuesta del servidor no reconocida' };
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Error de conexión';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Calcular progreso de una meta
  const calculateProgress = useCallback((goal) => {
    if (!goal || !goal.targetAmount) return 0;
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    return Math.min(progress, 100); // Máximo 100%
  }, []);

  // Obtener metas activas
  const getActiveGoals = useCallback(() => {
    const now = new Date();
    return goals.filter(goal => {
      if (!goal.endDate) return true; // Si no hay fecha límite, está activa
      return new Date(goal.endDate) >= now;
    });
  }, [goals]);

  // Obtener metas completadas
  const getCompletedGoals = useCallback(() => {
    return goals.filter(goal => goal.currentAmount >= goal.targetAmount);
  }, [goals]);

  // Obtener metas vencidas
  const getExpiredGoals = useCallback(() => {
    const now = new Date();
    return goals.filter(goal => {
      if (!goal.endDate) return false;
      return new Date(goal.endDate) < now && goal.currentAmount < goal.targetAmount;
    });
  }, [goals]);

  // Actualizar progreso de una meta (agregar dinero)
  const addToGoal = useCallback(async (id, amount) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return { success: false, message: 'Meta no encontrada' };

    const newAmount = goal.currentAmount + amount;
    return await editGoal(id, { ...goal, currentAmount: newAmount });
  }, [goals, editGoal]);

  // Cargar metas al montar el componente
  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  return {
    goals,
    loading,
    error,
    loadGoals,
    addGoal,
    editGoal,
    removeGoal,
    getGoalDetails,
    calculateProgress,
    getActiveGoals,
    getCompletedGoals,
    getExpiredGoals,
    addToGoal
  };
};
