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

  // Cargar todas las categorías
  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getCategory();
      
      // Manejar diferentes estructuras de respuesta
      if (response.success !== undefined) {
        // API devuelve {success, data, message}
        if (response.success) {
          setCategories(response.data || []);
        } else {
          setError(response.message || 'Error al cargar categorías');
        }
      } else if (Array.isArray(response)) {
        // API devuelve directamente un array
        setCategories(response);
      } else if (response.data && Array.isArray(response.data)) {
        // API devuelve {data: [...]}
        setCategories(response.data);
      } else {
        // Asumir que la respuesta directa son los datos
        setCategories(response || []);
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear una nueva categoría
  const addCategory = useCallback(async (categoryData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await createCategory(categoryData);
      
      // Verificar si la respuesta tiene la estructura esperada
      if (response && response.success !== undefined) {
        // API devuelve {success, data, message}
        if (response.success) {
          setCategories(prev => [...prev, response.data]);
          return { success: true, data: response.data };
        } else {
          setError(response.message || 'Error al crear categoría');
          return { success: false, message: response.message };
        }
      } else {
        // La API podría estar devolviendo directamente el objeto creado
        if (response && (response.id || response._id)) {
          setCategories(prev => [...prev, response]);
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

  // Actualizar una categoría existente
  const editCategory = useCallback(async (id, categoryData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await updateCategory(id, categoryData);
      
      // Verificar si la respuesta tiene la estructura esperada
      if (response && response.success !== undefined) {
        // API devuelve {success, data, message}
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
        // La API podría estar devolviendo directamente el objeto actualizado
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

  // Eliminar una categoría
  const removeCategory = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await deleteCategory(id);
      
      // Verificar si la respuesta tiene la estructura esperada
      if (response && response.success !== undefined) {
        // API devuelve {success, data, message}
        if (response.success) {
          setCategories(prev => prev.filter(category => category.id !== id));
          return { success: true };
        } else {
          setError(response.message || 'Error al eliminar categoría');
          return { success: false, message: response.message };
        }
      } else {
        // Para eliminación, una respuesta vacía o con status 200 es éxito
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

  // Obtener una categoría por ID
  const getCategoryDetails = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getCategoryById(id);
      
      // Verificar si la respuesta tiene la estructura esperada
      if (response && response.success !== undefined) {
        // API devuelve {success, data, message}
        if (response.success) {
          return { success: true, data: response.data };
        } else {
          setError(response.message || 'Error al obtener categoría');
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

  // Filtrar categorías por tipo (income/expense)
  const getCategoriesByType = useCallback((type) => {
    return categories.filter(category => category.type === type);
  }, [categories]);

  // Buscar categoría por nombre
  const findCategoryByName = useCallback((name) => {
    return categories.find(category => 
      category.name.toLowerCase() === name.toLowerCase()
    );
  }, [categories]);

  // Cargar categorías al montar el componente
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
