import { ScheduleTransactionRepository } from '../../domain/repositories/ScheduleTransactionRepository.js';
import { ScheduleTransaction } from '../../domain/models/ScheduleTransaction.js';
import { ScheduleTransactionApi } from '../api/scheduleTransactionApi.js';

/**
 * Implementación concreta del repositorio de transacciones programadas
 * Utiliza API HTTP para persistencia de datos
 */
export class ApiScheduleTransactionRepository extends ScheduleTransactionRepository {
  
  constructor() {
    super();
    this.scheduleTransactionApi = ScheduleTransactionApi;
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
    
    return new ScheduleTransaction(
      apiData.id,
      apiData.userId,
      apiData.categoryId,
      apiData.description,
      parseFloat(apiData.amount),
      apiData.type,
      apiData.frequency,
      apiData.startDate,
      apiData.endDate,
      apiData.isActive,
      apiData.lastExecutedAt,
      parseInt(apiData.executionCount) || 0,
      apiData.maxExecutions ? parseInt(apiData.maxExecutions) : null,
      apiData.createdAt,
      apiData.updatedAt
    );
  }

  /**
   * Convierte modelo de dominio a formato API
   */
  _mapModelToApi(scheduleTransaction) {
    return {
      id: scheduleTransaction.id,
      userId: scheduleTransaction.userId,
      categoryId: scheduleTransaction.categoryId,
      description: scheduleTransaction.description,
      amount: scheduleTransaction.amount,
      type: scheduleTransaction.type,
      frequency: scheduleTransaction.frequency,
      startDate: scheduleTransaction.startDate,
      endDate: scheduleTransaction.endDate,
      isActive: scheduleTransaction.isActive,
      lastExecutedAt: scheduleTransaction.lastExecutedAt,
      executionCount: scheduleTransaction.executionCount,
      maxExecutions: scheduleTransaction.maxExecutions
    };
  }

  /**
   * Crea una nueva transacción programada
   */
  async create(scheduleTransaction) {
    try {
      const token = this._getAuthToken();
      const payload = this._mapModelToApi(scheduleTransaction);
      delete payload.id; // Remove ID for creation
      
      const response = await this.scheduleTransactionApi.create(payload, token);
      return this._mapApiToModel(response);
    } catch (error) {
      this._handleApiError(error, 'Error al crear la transacción programada');
    }
  }

  /**
   * Busca transacción programada por ID
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
      
      console.error('Error finding schedule transaction by ID:', error);
      throw new Error('Error al buscar la transacción programada');
    }
  }

  /**
   * Busca todas las transacciones programadas de un usuario
   */
  async findByUserId(userId) {
    try {
      const response = await axios.get(this.endpoint, {
        headers: this._getAuthHeaders(),
        params: { userId }
      });
      
      return response.data.map(item => this._mapApiToModel(item));
    } catch (error) {
      console.error('Error finding schedule transactions by user ID:', error);
      
      if (error.response?.status === 401) {
        throw new Error('No autorizado. Por favor inicia sesión nuevamente.');
      }
      
      throw new Error('Error al obtener las transacciones programadas del usuario');
    }
  }

  /**
   * Busca transacciones programadas activas
   */
  async findActiveByUserId(userId) {
    try {
      const response = await axios.get(`${this.endpoint}/active`, {
        headers: this._getAuthHeaders(),
        params: { userId }
      });
      
      return response.data.map(item => this._mapApiToModel(item));
    } catch (error) {
      console.error('Error finding active schedule transactions:', error);
      
      if (error.response?.status === 401) {
        throw new Error('No autorizado. Por favor inicia sesión nuevamente.');
      }
      
      throw new Error('Error al obtener las transacciones programadas activas');
    }
  }

  /**
   * Busca transacciones programadas por categoría
   */
  async findByCategoryId(categoryId) {
    try {
      const response = await axios.get(this.endpoint, {
        headers: this._getAuthHeaders(),
        params: { categoryId }
      });
      
      return response.data.map(item => this._mapApiToModel(item));
    } catch (error) {
      console.error('Error finding schedule transactions by category:', error);
      throw new Error('Error al obtener las transacciones programadas de la categoría');
    }
  }

  /**
   * Busca transacciones programadas por frecuencia
   */
  async findByFrequency(frequency, userId) {
    try {
      const response = await axios.get(`${this.endpoint}/frequency/${frequency}`, {
        headers: this._getAuthHeaders(),
        params: { userId }
      });
      
      return response.data.map(item => this._mapApiToModel(item));
    } catch (error) {
      console.error('Error finding schedule transactions by frequency:', error);
      throw new Error('Error al obtener las transacciones programadas por frecuencia');
    }
  }

  /**
   * Busca transacciones programadas que necesitan ejecutarse
   */
  async findPendingExecution() {
    try {
      const response = await axios.get(`${this.endpoint}/pending`, {
        headers: this._getAuthHeaders()
      });
      
      return response.data.map(item => this._mapApiToModel(item));
    } catch (error) {
      console.error('Error finding pending schedule transactions:', error);
      throw new Error('Error al obtener las transacciones programadas pendientes');
    }
  }

  /**
   * Actualiza una transacción programada
   */
  async update(scheduleTransaction) {
    try {
      // Validar que existe el ID
      if (!scheduleTransaction.id) {
        throw new Error('ID de transacción programada requerido para actualización');
      }

      const payload = this._mapModelToApi(scheduleTransaction);
      
      const response = await axios.put(`${this.endpoint}/${scheduleTransaction.id}`, payload, {
        headers: this._getAuthHeaders()
      });
      
      return this._mapApiToModel(response.data);
    } catch (error) {
      console.error('Error updating schedule transaction:', error);
      
      if (error.response?.status === 401) {
        throw new Error('No autorizado. Por favor inicia sesión nuevamente.');
      }
      
      if (error.response?.status === 404) {
        throw new Error('Transacción programada no encontrada');
      }
      
      if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || 'Datos de actualización inválidos');
      }
      
      throw new Error('Error al actualizar la transacción programada');
    }
  }

  /**
   * Actualiza el contador de ejecuciones
   */
  async updateExecutionCount(id, executionCount, lastExecutedAt = new Date()) {
    try {
      const response = await axios.patch(`${this.endpoint}/${id}/execution`, {
        executionCount,
        lastExecutedAt: lastExecutedAt.toISOString()
      }, {
        headers: this._getAuthHeaders()
      });
      
      return this._mapApiToModel(response.data);
    } catch (error) {
      console.error('Error updating execution count:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Transacción programada no encontrada');
      }
      
      throw new Error('Error al actualizar el contador de ejecuciones');
    }
  }

  /**
   * Activa o desactiva una transacción programada
   */
  async toggleActive(id, isActive) {
    try {
      const response = await axios.patch(`${this.endpoint}/${id}/toggle`, {
        isActive
      }, {
        headers: this._getAuthHeaders()
      });
      
      return this._mapApiToModel(response.data);
    } catch (error) {
      console.error('Error toggling schedule transaction:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Transacción programada no encontrada');
      }
      
      throw new Error('Error al cambiar el estado de la transacción programada');
    }
  }

  /**
   * Elimina una transacción programada
   */
  async delete(id) {
    try {
      await axios.delete(`${this.endpoint}/${id}`, {
        headers: this._getAuthHeaders()
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting schedule transaction:', error);
      
      if (error.response?.status === 401) {
        throw new Error('No autorizado. Por favor inicia sesión nuevamente.');
      }
      
      if (error.response?.status === 404) {
        throw new Error('Transacción programada no encontrada');
      }
      
      throw new Error('Error al eliminar la transacción programada');
    }
  }

  /**
   * Verifica si existe una descripción similar
   */
  async existsByDescription(description, userId, excludeId = null) {
    try {
      const scheduleTransactions = await this.findByUserId(userId);
      
      return scheduleTransactions.some(schedule => 
        schedule.id !== excludeId && 
        schedule.description.toLowerCase().trim() === description.toLowerCase().trim()
      );
    } catch (error) {
      console.error('Error checking schedule transaction description:', error);
      throw new Error('Error al verificar la descripción de la transacción programada');
    }
  }

  /**
   * Obtiene estadísticas de transacciones programadas
   */
  async getStatistics(userId) {
    try {
      const response = await axios.get(`${this.endpoint}/statistics`, {
        headers: this._getAuthHeaders(),
        params: { userId }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error getting schedule transaction statistics:', error);
      throw new Error('Error al obtener estadísticas de transacciones programadas');
    }
  }
}
