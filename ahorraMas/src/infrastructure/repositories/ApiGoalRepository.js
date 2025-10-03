import { GoalRepository } from '../../domain/repositories/GoalRepository.js';
import { Goal } from '../../domain/models/Goal.js';
import axios from 'axios';

/**
 * Implementación concreta del repositorio de metas
 * Utiliza API HTTP para persistencia de datos
 */
export class ApiGoalRepository extends GoalRepository {
  
  constructor() {
    super();
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    this.endpoint = `${this.baseURL}/goals`;
  }

  /**
   * Configura headers de autenticación
   */
  _getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : undefined
    };
  }

  /**
   * Convierte respuesta de API a modelo de dominio
   */
  _mapApiToModel(apiData) {
    if (!apiData) return null;
    
    return new Goal(
      apiData.id,
      apiData.userId,
      apiData.title,
      apiData.description,
      parseFloat(apiData.targetAmount),
      apiData.type,
      apiData.categoryId,
      apiData.startDate,
      apiData.endDate,
      apiData.isCompleted,
      apiData.completedAt,
      apiData.createdAt,
      apiData.updatedAt
    );
  }

  /**
   * Convierte modelo de dominio a formato API
   */
  _mapModelToApi(goal) {
    return {
      id: goal.id,
      userId: goal.userId,
      title: goal.title,
      description: goal.description,
      targetAmount: goal.targetAmount,
      type: goal.type,
      categoryId: goal.categoryId,
      startDate: goal.startDate,
      endDate: goal.endDate,
      isCompleted: goal.isCompleted,
      completedAt: goal.completedAt
    };
  }

  /**
   * Crea una nueva meta
   */
  async create(goal) {
    try {
      const payload = this._mapModelToApi(goal);
      delete payload.id; // Remove ID for creation
      
      const response = await axios.post(this.endpoint, payload, {
        headers: this._getAuthHeaders()
      });
      
      return this._mapApiToModel(response.data);
    } catch (error) {
      console.error('Error creating goal:', error);
      
      if (error.response?.status === 401) {
        throw new Error('No autorizado. Por favor inicia sesión nuevamente.');
      }
      
      if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || 'Datos de meta inválidos');
      }
      
      throw new Error('Error al crear la meta');
    }
  }

  /**
   * Busca meta por ID
   */
  async findById(id) {
    try {
      const response = await axios.get(`${this.endpoint}/${id}`, {
        headers: this._getAuthHeaders()
      });
      
      return this._mapApiToModel(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      
      console.error('Error finding goal by ID:', error);
      throw new Error('Error al buscar la meta');
    }
  }

  /**
   * Busca todas las metas de un usuario
   */
  async findByUserId(userId) {
    try {
      const response = await axios.get(this.endpoint, {
        headers: this._getAuthHeaders(),
        params: { userId }
      });
      
      return response.data.map(item => this._mapApiToModel(item));
    } catch (error) {
      console.error('Error finding goals by user ID:', error);
      
      if (error.response?.status === 401) {
        throw new Error('No autorizado. Por favor inicia sesión nuevamente.');
      }
      
      throw new Error('Error al obtener las metas del usuario');
    }
  }

  /**
   * Busca metas activas de un usuario
   */
  async findActiveByUserId(userId) {
    try {
      const response = await axios.get(`${this.endpoint}/active`, {
        headers: this._getAuthHeaders(),
        params: { userId }
      });
      
      return response.data.map(item => this._mapApiToModel(item));
    } catch (error) {
      console.error('Error finding active goals:', error);
      
      if (error.response?.status === 401) {
        throw new Error('No autorizado. Por favor inicia sesión nuevamente.');
      }
      
      throw new Error('Error al obtener las metas activas');
    }
  }

  /**
   * Busca metas por categoría
   */
  async findByCategoryId(categoryId) {
    try {
      const response = await axios.get(this.endpoint, {
        headers: this._getAuthHeaders(),
        params: { categoryId }
      });
      
      return response.data.map(item => this._mapApiToModel(item));
    } catch (error) {
      console.error('Error finding goals by category:', error);
      throw new Error('Error al obtener las metas de la categoría');
    }
  }

  /**
   * Busca metas por tipo
   */
  async findByType(type, userId) {
    try {
      const response = await axios.get(`${this.endpoint}/type/${type}`, {
        headers: this._getAuthHeaders(),
        params: { userId }
      });
      
      return response.data.map(item => this._mapApiToModel(item));
    } catch (error) {
      console.error('Error finding goals by type:', error);
      throw new Error('Error al obtener las metas por tipo');
    }
  }

  /**
   * Busca metas en un rango de fechas
   */
  async findByDateRange(startDate, endDate, userId) {
    try {
      const response = await axios.get(`${this.endpoint}/date-range`, {
        headers: this._getAuthHeaders(),
        params: { 
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          userId 
        }
      });
      
      return response.data.map(item => this._mapApiToModel(item));
    } catch (error) {
      console.error('Error finding goals by date range:', error);
      throw new Error('Error al obtener las metas por rango de fechas');
    }
  }

  /**
   * Busca metas completadas de un usuario
   */
  async findCompletedByUserId(userId) {
    try {
      const response = await axios.get(`${this.endpoint}/completed`, {
        headers: this._getAuthHeaders(),
        params: { userId }
      });
      
      return response.data.map(item => this._mapApiToModel(item));
    } catch (error) {
      console.error('Error finding completed goals:', error);
      throw new Error('Error al obtener las metas completadas');
    }
  }

  /**
   * Actualiza una meta
   */
  async update(goal) {
    try {
      // Validar que existe el ID
      if (!goal.id) {
        throw new Error('ID de meta requerido para actualización');
      }

      const payload = this._mapModelToApi(goal);
      
      const response = await axios.put(`${this.endpoint}/${goal.id}`, payload, {
        headers: this._getAuthHeaders()
      });
      
      return this._mapApiToModel(response.data);
    } catch (error) {
      console.error('Error updating goal:', error);
      
      if (error.response?.status === 401) {
        throw new Error('No autorizado. Por favor inicia sesión nuevamente.');
      }
      
      if (error.response?.status === 404) {
        throw new Error('Meta no encontrada');
      }
      
      if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || 'Datos de actualización inválidos');
      }
      
      throw new Error('Error al actualizar la meta');
    }
  }

  /**
   * Marca una meta como completada
   */
  async markAsCompleted(id) {
    try {
      const response = await axios.patch(`${this.endpoint}/${id}/complete`, {
        isCompleted: true,
        completedAt: new Date().toISOString()
      }, {
        headers: this._getAuthHeaders()
      });
      
      return this._mapApiToModel(response.data);
    } catch (error) {
      console.error('Error marking goal as completed:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Meta no encontrada');
      }
      
      throw new Error('Error al marcar la meta como completada');
    }
  }

  /**
   * Reactiva una meta completada
   */
  async reactivate(id) {
    try {
      const response = await axios.patch(`${this.endpoint}/${id}/reactivate`, {
        isCompleted: false,
        completedAt: null
      }, {
        headers: this._getAuthHeaders()
      });
      
      return this._mapApiToModel(response.data);
    } catch (error) {
      console.error('Error reactivating goal:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Meta no encontrada');
      }
      
      throw new Error('Error al reactivar la meta');
    }
  }

  /**
   * Elimina una meta
   */
  async delete(id) {
    try {
      await axios.delete(`${this.endpoint}/${id}`, {
        headers: this._getAuthHeaders()
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting goal:', error);
      
      if (error.response?.status === 401) {
        throw new Error('No autorizado. Por favor inicia sesión nuevamente.');
      }
      
      if (error.response?.status === 404) {
        throw new Error('Meta no encontrada');
      }
      
      throw new Error('Error al eliminar la meta');
    }
  }

  /**
   * Verifica si existe una meta con el mismo título
   */
  async existsByTitle(title, userId, excludeId = null) {
    try {
      const goals = await this.findByUserId(userId);
      
      return goals.some(goal => 
        goal.id !== excludeId && 
        goal.title.toLowerCase().trim() === title.toLowerCase().trim()
      );
    } catch (error) {
      console.error('Error checking goal title:', error);
      throw new Error('Error al verificar el título de la meta');
    }
  }

  /**
   * Cuenta metas por estado
   */
  async countByStatus(userId) {
    try {
      const response = await axios.get(`${this.endpoint}/count/status`, {
        headers: this._getAuthHeaders(),
        params: { userId }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error counting goals by status:', error);
      throw new Error('Error al contar metas por estado');
    }
  }

  /**
   * Obtiene estadísticas de metas
   */
  async getStatistics(userId) {
    try {
      const response = await axios.get(`${this.endpoint}/statistics`, {
        headers: this._getAuthHeaders(),
        params: { userId }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error getting goal statistics:', error);
      throw new Error('Error al obtener estadísticas de metas');
    }
  }

  /**
   * Busca metas que vencen pronto
   */
  async findExpiringSoon(days = 30, userId) {
    try {
      const response = await axios.get(`${this.endpoint}/expiring`, {
        headers: this._getAuthHeaders(),
        params: { days, userId }
      });
      
      return response.data.map(item => this._mapApiToModel(item));
    } catch (error) {
      console.error('Error finding expiring goals:', error);
      throw new Error('Error al obtener metas que vencen pronto');
    }
  }
}
