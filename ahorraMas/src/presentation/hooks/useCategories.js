import { useState, useEffect, useCallback } from 'react';
import { 
  getCategory, 
  createCategory, 
  updateCategory, 
  deleteCategory, 
  getCategoryById 
} from '../../data/categoryRepository';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getCategory();
      
      if (response.success !== undefined) {
        if (response.success) {
          setCategories(response.data || []);
        } else {
          setError(response.message || 'Error al cargar categorías');
        }
      } else if (Array.isArray(response)) {
        setCategories(response);
      } else if (response.data && Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        setCategories(response || []);
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  }, []);

  const addCategory = useCallback(async (categoryData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await createCategory(categoryData);
      
      
      
      if (response && response.success !== undefined) {
        if (response.success) {
          if (response.data) {
            setCategories(prev => [...prev, response.data]);
          } else {
            await loadCategories();
          }
          return { success: true, data: response.data };
        } else {
          setError(response.message || 'Error al crear categoría');
          return { success: false, message: response.message };
        }
      } else if (Array.isArray(response)) {
        setCategories(response);
        return { success: true, data: response };
      } else {
        if (response && (response.id || response._id)) {
          setCategories(prev => [...prev, response]);
          return { success: true, data: response };
        } else {
          await loadCategories();
          setError('Categoría creada pero no se pudo confirmar');
          return { success: true, message: 'Categoría creada' };
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Error de conexión';
      setError(message);
      await loadCategories();
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [loadCategories]);

  const editCategory = useCallback(async (id, categoryData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await updateCategory(id, categoryData);
      
      if (response && response.success !== undefined) {
        if (response.success) {
          setCategories(prev => 
            prev.map(category => 
              category.id === id ? response.data : category
            )
          );
          return { success: true, data: response.data };
        } else {
          setError(response.message || 'Error al actualizar categoría');
          return { success: false, message: response.message };
        }
      } else {
        if (response && (response.id || response._id)) {
          setCategories(prev => 
            prev.map(category => 
              category.id === id ? response : category
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

  const removeCategory = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await deleteCategory(id);
      
      if (response && response.success !== undefined) {
        if (response.success) {
          setCategories(prev => prev.filter(category => category.id !== id));
          return { success: true };
        } else {
          setError(response.message || 'Error al eliminar categoría');
          return { success: false, message: response.message };
        }
      } else {
        setCategories(prev => prev.filter(category => category.id !== id));
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

  const getCategoryDetails = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getCategoryById(id);
      
      if (response && response.success !== undefined) {
        if (response.success) {
          return { success: true, data: response.data };
        } else {
          setError(response.message || 'Error al obtener categoría');
          return { success: false, message: response.message };
        }
      } else {
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

  const getCategoriesByType = useCallback((type) => {
    return categories.filter(category => category.type === type);
  }, [categories]);

  const findCategoryByName = useCallback((name) => {
    return categories.find(category => 
      category.name.toLowerCase() === name.toLowerCase()
    );
  }, [categories]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return {
    categories,
    loading,
    error,
    loadCategories,
    addCategory,
    editCategory,
    removeCategory,
    getCategoryDetails,
    getCategoriesByType,
    findCategoryByName
  };
};
