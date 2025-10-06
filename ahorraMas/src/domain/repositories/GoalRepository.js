/**
 * GoalRepository - Interfaz del repositorio de metas de ahorro
 */
export class GoalRepository {
  constructor() {
    if (this.constructor === GoalRepository) {
      throw new Error('GoalRepository es una clase abstracta');
    }
  }

  // Operaciones CRUD básicas
  async create(goal) {
    throw new Error('Método create() debe ser implementado');
  }

  async findById(id) {
    throw new Error('Método findById() debe ser implementado');
  }

  async findAll() {
    throw new Error('Método findAll() debe ser implementado');
  }

  async findByUserId(userId) {
    throw new Error('Método findByUserId() debe ser implementado');
  }

  async update(id, goalData) {
    throw new Error('Método update() debe ser implementado');
  }

  async delete(id) {
    throw new Error('Método delete() debe ser implementado');
  }

  // Consultas específicas de metas
  async findActiveGoals(userId) {
    throw new Error('Método findActiveGoals() debe ser implementado');
  }

  async findCompletedGoals(userId) {
    throw new Error('Método findCompletedGoals() debe ser implementado');
  }

  async findByPriority(userId, priority) {
    throw new Error('Método findByPriority() debe ser implementado');
  }

  async findExpiring(userId, days = 30) {
    throw new Error('Método findExpiring() debe ser implementado');
  }

  // Operaciones de progreso
  async updateProgress(id, amount) {
    throw new Error('Método updateProgress() debe ser implementado');
  }

  async addToGoal(id, amount) {
    throw new Error('Método addToGoal() debe ser implementado');
  }

  async subtractFromGoal(id, amount) {
    throw new Error('Método subtractFromGoal() debe ser implementado');
  }

  // Estadísticas
  async getTotalSaved(userId) {
    throw new Error('Método getTotalSaved() debe ser implementado');
  }

  async getAverageProgress(userId) {
    throw new Error('Método getAverageProgress() debe ser implementado');
  }

  // Validaciones
  validateGoalData(goalData) {
    const errors = [];
    
    if (!goalData.name || goalData.name.trim().length < 2) {
      errors.push('Nombre debe tener al menos 2 caracteres');
    }
    
    if (!goalData.targetAmount || goalData.targetAmount <= 0) {
      errors.push('El monto objetivo debe ser mayor a 0');
    }
    
    if (goalData.currentAmount < 0) {
      errors.push('El monto actual no puede ser negativo');
    }
    
    if (!['low', 'medium', 'high'].includes(goalData.priority)) {
      errors.push('Prioridad debe ser low, medium o high');
    }
    
    if (!['active', 'completed', 'paused'].includes(goalData.status)) {
      errors.push('Estado debe ser active, completed o paused');
    }
    
    if (goalData.targetDate && new Date(goalData.targetDate) <= new Date()) {
      errors.push('La fecha objetivo debe ser futura');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
