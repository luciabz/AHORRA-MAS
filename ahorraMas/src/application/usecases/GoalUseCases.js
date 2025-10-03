import { 
  CreateGoalDto, 
  UpdateGoalDto 
} from '../dto/GoalDto.js';
import { GoalRepository } from '../../domain/repositories/GoalRepository.js';

/**
 * Casos de uso para metas financieras
 * Encapsula la lógica de negocio y coordina las operaciones
 */
export class GoalUseCases {
  
  constructor(goalRepository) {
    if (!(goalRepository instanceof GoalRepository)) {
      throw new Error('goalRepository debe ser una instancia de GoalRepository');
    }
    this.goalRepository = goalRepository;
  }

  /**
   * Crear una nueva meta
   */
  async createGoal(goalData) {
    try {
      // Validar datos de entrada
      const createDto = new CreateGoalDto(goalData);
      const validationErrors = createDto.validate();
      
      if (validationErrors.length > 0) {
        throw new Error(`Errores de validación: ${validationErrors.join(', ')}`);
      }

      // Verificar que no exista una meta con el mismo título
      const existingGoal = await this.goalRepository.existsByTitle(
        createDto.title,
        createDto.userId
      );

      if (existingGoal) {
        throw new Error('Ya existe una meta con ese título');
      }

      // Crear la meta
      const goal = createDto.toModel();
      return await this.goalRepository.create(goal);
      
    } catch (error) {
      console.error('Error in createGoal:', error);
      throw new Error(`Error al crear meta: ${error.message}`);
    }
  }

  /**
   * Obtener meta por ID
   */
  async getGoalById(id) {
    try {
      if (!id) {
        throw new Error('ID de meta requerido');
      }

      const goal = await this.goalRepository.findById(id);
      
      if (!goal) {
        throw new Error('Meta no encontrada');
      }

      return goal;
      
    } catch (error) {
      console.error('Error in getGoalById:', error);
      throw new Error(`Error al obtener meta: ${error.message}`);
    }
  }

  /**
   * Obtener todas las metas de un usuario
   */
  async getGoalsByUserId(userId) {
    try {
      if (!userId) {
        throw new Error('ID de usuario requerido');
      }

      return await this.goalRepository.findByUserId(userId);
      
    } catch (error) {
      console.error('Error in getGoalsByUserId:', error);
      throw new Error(`Error al obtener metas del usuario: ${error.message}`);
    }
  }

  /**
   * Obtener metas activas de un usuario
   */
  async getActiveGoals(userId) {
    try {
      if (!userId) {
        throw new Error('ID de usuario requerido');
      }

      return await this.goalRepository.findActiveByUserId(userId);
      
    } catch (error) {
      console.error('Error in getActiveGoals:', error);
      throw new Error(`Error al obtener metas activas: ${error.message}`);
    }
  }

  /**
   * Obtener metas por categoría
   */
  async getGoalsByCategory(categoryId) {
    try {
      if (!categoryId) {
        throw new Error('ID de categoría requerido');
      }

      return await this.goalRepository.findByCategoryId(categoryId);
      
    } catch (error) {
      console.error('Error in getGoalsByCategory:', error);
      throw new Error(`Error al obtener metas por categoría: ${error.message}`);
    }
  }

  /**
   * Obtener metas por tipo
   */
  async getGoalsByType(type, userId) {
    try {
      if (!type || !userId) {
        throw new Error('Tipo de meta y ID de usuario requeridos');
      }

      const validTypes = ['saving', 'expense_limit', 'income_target'];
      if (!validTypes.includes(type)) {
        throw new Error('Tipo de meta inválido');
      }

      return await this.goalRepository.findByType(type, userId);
      
    } catch (error) {
      console.error('Error in getGoalsByType:', error);
      throw new Error(`Error al obtener metas por tipo: ${error.message}`);
    }
  }

  /**
   * Obtener metas en un rango de fechas
   */
  async getGoalsByDateRange(startDate, endDate, userId) {
    try {
      if (!startDate || !endDate || !userId) {
        throw new Error('Fechas y ID de usuario requeridos');
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start >= end) {
        throw new Error('La fecha de inicio debe ser anterior a la fecha de fin');
      }

      return await this.goalRepository.findByDateRange(start, end, userId);
      
    } catch (error) {
      console.error('Error in getGoalsByDateRange:', error);
      throw new Error(`Error al obtener metas por rango de fechas: ${error.message}`);
    }
  }

  /**
   * Obtener metas completadas de un usuario
   */
  async getCompletedGoals(userId) {
    try {
      if (!userId) {
        throw new Error('ID de usuario requerido');
      }

      return await this.goalRepository.findCompletedByUserId(userId);
      
    } catch (error) {
      console.error('Error in getCompletedGoals:', error);
      throw new Error(`Error al obtener metas completadas: ${error.message}`);
    }
  }

  /**
   * Actualizar una meta
   */
  async updateGoal(id, updateData) {
    try {
      if (!id) {
        throw new Error('ID de meta requerido');
      }

      // Verificar que la meta existe
      const existingGoal = await this.goalRepository.findById(id);
      if (!existingGoal) {
        throw new Error('Meta no encontrada');
      }

      // Validar datos de actualización
      const updateDto = new UpdateGoalDto(updateData);
      const validationErrors = updateDto.validate();
      
      if (validationErrors.length > 0) {
        throw new Error(`Errores de validación: ${validationErrors.join(', ')}`);
      }

      // Verificar título único si se está actualizando
      if (updateDto.title && updateDto.title !== existingGoal.title) {
        const titleExists = await this.goalRepository.existsByTitle(
          updateDto.title,
          existingGoal.userId,
          id
        );

        if (titleExists) {
          throw new Error('Ya existe una meta con ese título');
        }
      }

      // Actualizar la meta
      const updatedGoal = updateDto.toModel(existingGoal);
      return await this.goalRepository.update(updatedGoal);
      
    } catch (error) {
      console.error('Error in updateGoal:', error);
      throw new Error(`Error al actualizar meta: ${error.message}`);
    }
  }

  /**
   * Marcar meta como completada
   */
  async completeGoal(id) {
    try {
      if (!id) {
        throw new Error('ID de meta requerido');
      }

      // Verificar que la meta existe y no está completada
      const existingGoal = await this.goalRepository.findById(id);
      if (!existingGoal) {
        throw new Error('Meta no encontrada');
      }

      if (existingGoal.isCompleted) {
        throw new Error('La meta ya está completada');
      }

      return await this.goalRepository.markAsCompleted(id);
      
    } catch (error) {
      console.error('Error in completeGoal:', error);
      throw new Error(`Error al completar meta: ${error.message}`);
    }
  }

  /**
   * Reactivar una meta completada
   */
  async reactivateGoal(id) {
    try {
      if (!id) {
        throw new Error('ID de meta requerido');
      }

      // Verificar que la meta existe y está completada
      const existingGoal = await this.goalRepository.findById(id);
      if (!existingGoal) {
        throw new Error('Meta no encontrada');
      }

      if (!existingGoal.isCompleted) {
        throw new Error('La meta no está completada');
      }

      return await this.goalRepository.reactivate(id);
      
    } catch (error) {
      console.error('Error in reactivateGoal:', error);
      throw new Error(`Error al reactivar meta: ${error.message}`);
    }
  }

  /**
   * Eliminar una meta
   */
  async deleteGoal(id) {
    try {
      if (!id) {
        throw new Error('ID de meta requerido');
      }

      // Verificar que la meta existe
      const existingGoal = await this.goalRepository.findById(id);
      if (!existingGoal) {
        throw new Error('Meta no encontrada');
      }

      return await this.goalRepository.delete(id);
      
    } catch (error) {
      console.error('Error in deleteGoal:', error);
      throw new Error(`Error al eliminar meta: ${error.message}`);
    }
  }

  /**
   * Contar metas por estado
   */
  async countGoalsByStatus(userId) {
    try {
      if (!userId) {
        throw new Error('ID de usuario requerido');
      }

      return await this.goalRepository.countByStatus(userId);
      
    } catch (error) {
      console.error('Error in countGoalsByStatus:', error);
      throw new Error(`Error al contar metas por estado: ${error.message}`);
    }
  }

  /**
   * Obtener estadísticas de metas
   */
  async getGoalStatistics(userId) {
    try {
      if (!userId) {
        throw new Error('ID de usuario requerido');
      }

      return await this.goalRepository.getStatistics(userId);
      
    } catch (error) {
      console.error('Error in getGoalStatistics:', error);
      throw new Error(`Error al obtener estadísticas de metas: ${error.message}`);
    }
  }

  /**
   * Obtener metas que vencen pronto
   */
  async getExpiringSoonGoals(days = 30, userId) {
    try {
      if (!userId) {
        throw new Error('ID de usuario requerido');
      }

      if (typeof days !== 'number' || days <= 0) {
        throw new Error('Número de días inválido');
      }

      return await this.goalRepository.findExpiringSoon(days, userId);
      
    } catch (error) {
      console.error('Error in getExpiringSoonGoals:', error);
      throw new Error(`Error al obtener metas que vencen pronto: ${error.message}`);
    }
  }

  /**
   * Validar datos de meta
   */
  async validateGoalData(goalData, isUpdate = false) {
    try {
      const dto = isUpdate ? new UpdateGoalDto(goalData) : new CreateGoalDto(goalData);
      const validationErrors = dto.validate();
      
      // Validaciones adicionales de negocio
      const businessErrors = [];

      // Validar fechas
      if (goalData.startDate) {
        const startDate = new Date(goalData.startDate);
        const now = new Date();
        
        if (startDate < now && !isUpdate) {
          businessErrors.push('La fecha de inicio no puede ser anterior a hoy');
        }
      }

      if (goalData.endDate && goalData.startDate) {
        const endDate = new Date(goalData.endDate);
        const startDate = new Date(goalData.startDate);
        
        if (endDate <= startDate) {
          businessErrors.push('La fecha de fin debe ser posterior a la fecha de inicio');
        }
      }

      // Validar monto objetivo
      if (goalData.targetAmount) {
        const amount = parseFloat(goalData.targetAmount);
        if (amount <= 0) {
          businessErrors.push('El monto objetivo debe ser mayor a cero');
        }
      }

      return {
        isValid: validationErrors.length === 0 && businessErrors.length === 0,
        validationErrors,
        businessErrors,
        allErrors: [...validationErrors, ...businessErrors]
      };
      
    } catch (error) {
      console.error('Error in validateGoalData:', error);
      throw new Error(`Error al validar datos de meta: ${error.message}`);
    }
  }

  /**
   * Buscar metas por texto
   */
  async searchGoals(searchText, userId) {
    try {
      if (!userId) {
        throw new Error('ID de usuario requerido');
      }

      if (!searchText || searchText.trim() === '') {
        return [];
      }

      // Obtener todas las metas del usuario
      const goals = await this.goalRepository.findByUserId(userId);
      
      // Filtrar por texto de búsqueda
      const searchTerm = searchText.toLowerCase().trim();
      
      return goals.filter(goal => 
        goal.title.toLowerCase().includes(searchTerm) ||
        (goal.description && goal.description.toLowerCase().includes(searchTerm))
      );
      
    } catch (error) {
      console.error('Error in searchGoals:', error);
      throw new Error(`Error al buscar metas: ${error.message}`);
    }
  }

  /**
   * Duplicar una meta
   */
  async duplicateGoal(id, newTitle) {
    try {
      if (!id) {
        throw new Error('ID de meta requerido');
      }

      // Obtener la meta original
      const originalGoal = await this.goalRepository.findById(id);
      if (!originalGoal) {
        throw new Error('Meta no encontrada');
      }

      // Crear nueva meta basada en la original
      const duplicateData = {
        userId: originalGoal.userId,
        title: newTitle || `Copia de ${originalGoal.title}`,
        description: originalGoal.description,
        targetAmount: originalGoal.targetAmount,
        type: originalGoal.type,
        categoryId: originalGoal.categoryId,
        startDate: new Date().toISOString(),
        endDate: originalGoal.endDate
      };

      return await this.createGoal(duplicateData);
      
    } catch (error) {
      console.error('Error in duplicateGoal:', error);
      throw new Error(`Error al duplicar meta: ${error.message}`);
    }
  }
}
