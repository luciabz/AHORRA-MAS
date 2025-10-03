import { CategoryRepository } from '../../domain/repositories/CategoryRepository.js';
import { Category } from '../../domain/models/Category.js';
import { CategoryApi } from '../api/categoryApi.js';

/**
 * ApiCategoryRepository - Implementación concreta del repositorio de categorías
 * Utiliza CategoryApi para las llamadas HTTP y añade lógica de dominio
 */
export class ApiCategoryRepository extends CategoryRepository {
  constructor() {
    super();
    this.categoryApi = CategoryApi;
  }

  /**
   * Convierte respuesta de API a modelo de dominio
   */
  _mapApiToModel(apiData) {
    if (!apiData) return null;
    
    return new Category(
      apiData.id,
      apiData.userId,
      apiData.name,
      apiData.description,
      apiData.type,
      apiData.color,
      apiData.icon,
      apiData.isActive,
      apiData.createdAt,
      apiData.updatedAt
    );
  }

  /**
   * Convierte modelo de dominio a formato API
   */
  _mapModelToApi(category) {
    return {
      id: category.id,
      userId: category.userId,
      name: category.name,
      description: category.description,
      type: category.type,
      color: category.color,
      icon: category.icon,
      isActive: category.isActive
    };
  }

  async create(category) {
    try {
      const token = this._getAuthToken();
      const apiData = this._mapModelToApi(category);
      const response = await this.categoryApi.create(apiData, token);
      return this._mapApiToModel(response);
    } catch (error) {
      this._handleApiError(error, 'Error creando categoría');
    }
  }

  async findById(id) {
    try {
      const token = this._getAuthToken();
      const response = await this.categoryApi.detail(id, token);
      return this._mapApiToModel(response);
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      this._handleApiError(error, 'Error obteniendo categoría');
    }
  }

  async findAll() {
    return this.findByUserId(); // La API ya filtra por usuario
  }

  async findByUserId(userId = null) {
    try {
      const token = this._getAuthToken();
      const response = await this.categoryApi.list(token);
      
      if (response && response.length > 0) {
        return response.map(item => this._mapApiToModel(item));
      }
      
      // Si no hay categorías del backend, devolver categorías básicas
      return this._getDefaultCategories();
    } catch (error) {
      console.warn('No se pudieron obtener categorías del backend:', error);
      // Devolver categorías por defecto en caso de error
      return this._getDefaultCategories();
    }
  }

  async update(id, categoryData) {
    try {
      const token = this._getAuthToken();
      const response = await this.categoryApi.update(id, categoryData, token);
      return this._mapApiToModel(response);
    } catch (error) {
      this._handleApiError(error, 'Error actualizando categoría');
    }
  }

  async delete(id) {
    try {
      const token = this._getAuthToken();
      await this.categoryApi.remove(id, token);
      return true;
    } catch (error) {
      this._handleApiError(error, 'Error eliminando categoría');
    }
  }

  // Consultas específicas con lógica de dominio
  async findByType(userId, type) {
    const categories = await this.findByUserId(userId);
    return categories.filter(category => category.type === type);
  }

  async findByName(userId, name) {
    const categories = await this.findByUserId(userId);
    return categories.find(category => 
      category.name.toLowerCase() === name.toLowerCase()
    );
  }

  async findActiveByUserId(userId) {
    const categories = await this.findByUserId(userId);
    return categories.filter(category => category.isActive);
  }

  // Validaciones de reglas de negocio
  async canDelete(id) {
    try {
      // Verificar si la categoría tiene transacciones asociadas
      // La API debería manejar esta validación
      const token = this._getAuthToken();
      const response = await this.categoryApi.canDelete?.(id, token);
      return response?.canDelete ?? true;
    } catch (error) {
      console.warn('Error verificando si se puede eliminar categoría:', error);
      return true; // En caso de error, permitir eliminación
    }
  }

  async existsByName(userId, name, excludeId = null) {
    try {
      const categories = await this.findByUserId(userId);
      const existingCategory = categories.find(category => 
        category.name.toLowerCase().trim() === name.toLowerCase().trim() && 
        (!excludeId || category.id !== excludeId)
      );
      return !!existingCategory;
    } catch (error) {
      console.warn('Error verificando unicidad del nombre:', error);
      return false; // En caso de error, asumir que no existe
    }
  }

  // Métodos auxiliares privados
  _getAuthToken() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }
    return token;
  }

  _getDefaultCategories() {
    return [
      this._mapApiToModel({
        id: 'cat-salary',
        name: 'Salario',
        type: 'income',
        userId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }),
      this._mapApiToModel({
        id: 'cat-rent',
        name: 'Alquiler',
        type: 'expense',
        userId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }),
      this._mapApiToModel({
        id: 'cat-food',
        name: 'Alimentación',
        type: 'expense',
        userId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }),
      this._mapApiToModel({
        id: 'cat-savings',
        name: 'Ahorro',
        type: 'expense',
        userId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }),
      this._mapApiToModel({
        id: 'cat-freelance',
        name: 'Freelance',
        type: 'income',
        userId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }),
      this._mapApiToModel({
        id: 'cat-services',
        name: 'Servicios',
        type: 'expense',
        userId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }),
      this._mapApiToModel({
        id: 'cat-transport',
        name: 'Transporte',
        type: 'expense',
        userId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    ];
  }

  _handleApiError(error, defaultMessage) {
    console.error('API Error:', error);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
    }
    
    if (error.response?.status === 403) {
      throw new Error('No tienes permisos para realizar esta acción.');
    }
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    if (error.response?.data?.errors) {
      const errors = Object.values(error.response.data.errors).flat();
      throw new Error(errors.join(', '));
    }
    
    if (error.message) {
      throw new Error(error.message);
    }
    
    throw new Error(defaultMessage);
  }
}
