import { 
  CreateScheduleTransactionDTO, 
  UpdateScheduleTransactionDTO 
} from '../dto/ScheduleTransactionDTO.js';
import { ScheduleTransactionRepository } from '../../domain/repositories/ScheduleTransactionRepository.js';

/**
 * Casos de uso para transacciones programadas
 * Encapsula la lógica de negocio y coordina las operaciones
 */
export class ScheduleTransactionUseCases {
  
  constructor(scheduleTransactionRepository) {
    if (!(scheduleTransactionRepository instanceof ScheduleTransactionRepository)) {
      throw new Error('scheduleTransactionRepository debe ser una instancia de ScheduleTransactionRepository');
    }
    this.scheduleTransactionRepository = scheduleTransactionRepository;
  }

  /**
   * Crear una nueva transacción programada
   */
  async createScheduleTransaction(scheduleTransactionData) {
    try {
      // Validar datos de entrada
      const createDto = new CreateScheduleTransactionDTO(scheduleTransactionData);
      const validationErrors = createDto.validate();
      
      if (validationErrors.length > 0) {
        throw new Error(`Errores de validación: ${validationErrors.join(', ')}`);
      }

      // Verificar que no exista una transacción similar
      const existingTransaction = await this.scheduleTransactionRepository.existsByDescription(
        createDto.description,
        createDto.userId
      );

      if (existingTransaction) {
        throw new Error('Ya existe una transacción programada con esa descripción');
      }

      // Crear la transacción programada
      const scheduleTransaction = createDto.toModel();
      return await this.scheduleTransactionRepository.create(scheduleTransaction);
      
    } catch (error) {
      console.error('Error in createScheduleTransaction:', error);
      throw new Error(`Error al crear transacción programada: ${error.message}`);
    }
  }

  /**
   * Obtener transacción programada por ID
   */
  async getScheduleTransactionById(id) {
    try {
      if (!id) {
        throw new Error('ID de transacción programada requerido');
      }

      const scheduleTransaction = await this.scheduleTransactionRepository.findById(id);
      
      if (!scheduleTransaction) {
        throw new Error('Transacción programada no encontrada');
      }

      return scheduleTransaction;
      
    } catch (error) {
      console.error('Error in getScheduleTransactionById:', error);
      throw new Error(`Error al obtener transacción programada: ${error.message}`);
    }
  }

  /**
   * Obtener todas las transacciones programadas de un usuario
   */
  async getScheduleTransactionsByUserId(userId) {
    try {
      if (!userId) {
        throw new Error('ID de usuario requerido');
      }

      return await this.scheduleTransactionRepository.findByUserId(userId);
      
    } catch (error) {
      console.error('Error in getScheduleTransactionsByUserId:', error);
      throw new Error(`Error al obtener transacciones programadas: ${error.message}`);
    }
  }

  /**
   * Obtener transacciones programadas activas de un usuario
   */
  async getActiveScheduleTransactions(userId) {
    try {
      if (!userId) {
        throw new Error('ID de usuario requerido');
      }

      return await this.scheduleTransactionRepository.findActiveByUserId(userId);
      
    } catch (error) {
      console.error('Error in getActiveScheduleTransactions:', error);
      throw new Error(`Error al obtener transacciones programadas activas: ${error.message}`);
    }
  }

  /**
   * Obtener transacciones programadas por categoría
   */
  async getScheduleTransactionsByCategory(categoryId) {
    try {
      if (!categoryId) {
        throw new Error('ID de categoría requerido');
      }

      return await this.scheduleTransactionRepository.findByCategoryId(categoryId);
      
    } catch (error) {
      console.error('Error in getScheduleTransactionsByCategory:', error);
      throw new Error(`Error al obtener transacciones programadas por categoría: ${error.message}`);
    }
  }

  /**
   * Obtener transacciones programadas por frecuencia
   */
  async getScheduleTransactionsByFrequency(frequency, userId) {
    try {
      if (!frequency || !userId) {
        throw new Error('Frecuencia y ID de usuario requeridos');
      }

      return await this.scheduleTransactionRepository.findByFrequency(frequency, userId);
      
    } catch (error) {
      console.error('Error in getScheduleTransactionsByFrequency:', error);
      throw new Error(`Error al obtener transacciones programadas por frecuencia: ${error.message}`);
    }
  }

  /**
   * Obtener transacciones programadas pendientes de ejecución
   */
  async getPendingExecutions() {
    try {
      return await this.scheduleTransactionRepository.findPendingExecution();
      
    } catch (error) {
      console.error('Error in getPendingExecutions:', error);
      throw new Error(`Error al obtener transacciones pendientes: ${error.message}`);
    }
  }

  /**
   * Actualizar una transacción programada
   */
  async updateScheduleTransaction(id, updateData) {
    try {
      if (!id) {
        throw new Error('ID de transacción programada requerido');
      }

      // Verificar que la transacción existe
      const existingTransaction = await this.scheduleTransactionRepository.findById(id);
      if (!existingTransaction) {
        throw new Error('Transacción programada no encontrada');
      }

      // Validar datos de actualización
      const updateDto = new UpdateScheduleTransactionDTO(updateData);
      const validationErrors = updateDto.validate();
      
      if (validationErrors.length > 0) {
        throw new Error(`Errores de validación: ${validationErrors.join(', ')}`);
      }

      // Verificar descripción única si se está actualizando
      if (updateDto.description && updateDto.description !== existingTransaction.description) {
        const descriptionExists = await this.scheduleTransactionRepository.existsByDescription(
          updateDto.description,
          existingTransaction.userId,
          id
        );

        if (descriptionExists) {
          throw new Error('Ya existe una transacción programada con esa descripción');
        }
      }

      // Actualizar la transacción
      const updatedTransaction = updateDto.toModel(existingTransaction);
      return await this.scheduleTransactionRepository.update(updatedTransaction);
      
    } catch (error) {
      console.error('Error in updateScheduleTransaction:', error);
      throw new Error(`Error al actualizar transacción programada: ${error.message}`);
    }
  }

  /**
   * Actualizar contador de ejecuciones
   */
  async updateExecutionCount(id, executionCount, lastExecutedAt = new Date()) {
    try {
      if (!id) {
        throw new Error('ID de transacción programada requerido');
      }

      if (typeof executionCount !== 'number' || executionCount < 0) {
        throw new Error('Contador de ejecuciones inválido');
      }

      return await this.scheduleTransactionRepository.updateExecutionCount(
        id, 
        executionCount, 
        lastExecutedAt
      );
      
    } catch (error) {
      console.error('Error in updateExecutionCount:', error);
      throw new Error(`Error al actualizar contador de ejecuciones: ${error.message}`);
    }
  }

  /**
   * Activar o desactivar una transacción programada
   */
  async toggleScheduleTransaction(id, isActive) {
    try {
      if (!id) {
        throw new Error('ID de transacción programada requerido');
      }

      if (typeof isActive !== 'boolean') {
        throw new Error('Estado de activación inválido');
      }

      return await this.scheduleTransactionRepository.toggleActive(id, isActive);
      
    } catch (error) {
      console.error('Error in toggleScheduleTransaction:', error);
      throw new Error(`Error al cambiar estado de transacción programada: ${error.message}`);
    }
  }

  /**
   * Eliminar una transacción programada
   */
  async deleteScheduleTransaction(id) {
    try {
      if (!id) {
        throw new Error('ID de transacción programada requerido');
      }

      // Verificar que la transacción existe
      const existingTransaction = await this.scheduleTransactionRepository.findById(id);
      if (!existingTransaction) {
        throw new Error('Transacción programada no encontrada');
      }

      return await this.scheduleTransactionRepository.delete(id);
      
    } catch (error) {
      console.error('Error in deleteScheduleTransaction:', error);
      throw new Error(`Error al eliminar transacción programada: ${error.message}`);
    }
  }

  /**
   * Obtener estadísticas de transacciones programadas
   */
  async getScheduleTransactionStatistics(userId) {
    try {
      if (!userId) {
        throw new Error('ID de usuario requerido');
      }

      return await this.scheduleTransactionRepository.getStatistics(userId);
      
    } catch (error) {
      console.error('Error in getScheduleTransactionStatistics:', error);
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }

  /**
   * Ejecutar transacciones programadas pendientes
   */
  async executePendingTransactions() {
    try {
      const pendingTransactions = await this.getPendingExecutions();
      const results = [];

      for (const scheduleTransaction of pendingTransactions) {
        try {
          // Aquí se ejecutaría la lógica para crear la transacción real
          // Por ahora solo actualizamos el contador
          await this.updateExecutionCount(
            scheduleTransaction.id,
            scheduleTransaction.executionCount + 1
          );

          results.push({
            id: scheduleTransaction.id,
            status: 'executed',
            message: 'Transacción ejecutada correctamente'
          });

        } catch (executionError) {
          results.push({
            id: scheduleTransaction.id,
            status: 'error',
            message: executionError.message
          });
        }
      }

      return results;
      
    } catch (error) {
      console.error('Error in executePendingTransactions:', error);
      throw new Error(`Error al ejecutar transacciones programadas: ${error.message}`);
    }
  }

  /**
   * Validar configuración de transacción programada
   */
  async validateScheduleConfiguration(scheduleData) {
    try {
      const createDto = new CreateScheduleTransactionDTO(scheduleData);
      const validationErrors = createDto.validate();
      
      // Validaciones adicionales de negocio
      const businessErrors = [];

      // Validar fechas
      const now = new Date();
      const startDate = new Date(scheduleData.startDate);
      
      if (startDate < now) {
        businessErrors.push('La fecha de inicio no puede ser anterior a hoy');
      }

      if (scheduleData.endDate) {
        const endDate = new Date(scheduleData.endDate);
        if (endDate <= startDate) {
          businessErrors.push('La fecha de fin debe ser posterior a la fecha de inicio');
        }
      }

      return {
        isValid: validationErrors.length === 0 && businessErrors.length === 0,
        validationErrors,
        businessErrors,
        allErrors: [...validationErrors, ...businessErrors]
      };
      
    } catch (error) {
      console.error('Error in validateScheduleConfiguration:', error);
      throw new Error(`Error al validar configuración: ${error.message}`);
    }
  }
}
