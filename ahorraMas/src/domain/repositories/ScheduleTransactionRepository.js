/**
 * ScheduleTransactionRepository - Interfaz del repositorio de transacciones programadas
 */
export class ScheduleTransactionRepository {
  constructor() {
    if (this.constructor === ScheduleTransactionRepository) {
      throw new Error('ScheduleTransactionRepository es una clase abstracta');
    }
  }

  // Operaciones CRUD básicas
  async create(scheduleTransaction) {
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

  async update(id, scheduleData) {
    throw new Error('Método update() debe ser implementado');
  }

  async delete(id) {
    throw new Error('Método delete() debe ser implementado');
  }

  // Consultas específicas de transacciones programadas
  async findActiveSchedules(userId) {
    throw new Error('Método findActiveSchedules() debe ser implementado');
  }

  async findDueSchedules(userId, date = new Date()) {
    throw new Error('Método findDueSchedules() debe ser implementado');
  }

  async findByPeriodicity(userId, periodicity) {
    throw new Error('Método findByPeriodicity() debe ser implementado');
  }

  async findExpiring(userId, days = 7) {
    throw new Error('Método findExpiring() debe ser implementado');
  }

  // Operaciones de estado
  async activate(id) {
    throw new Error('Método activate() debe ser implementado');
  }

  async deactivate(id) {
    throw new Error('Método deactivate() debe ser implementado');
  }

  async updateNextOccurrence(id, nextDate) {
    throw new Error('Método updateNextOccurrence() debe ser implementado');
  }

  // Validaciones específicas
  validateScheduleData(scheduleData) {
    const errors = [];
    
    if (!scheduleData.description || scheduleData.description.trim().length < 3) {
      errors.push('Descripción debe tener al menos 3 caracteres');
    }
    
    if (!scheduleData.amount || scheduleData.amount <= 0) {
      errors.push('El monto debe ser mayor a 0');
    }
    
    if (!['income', 'expense'].includes(scheduleData.type)) {
      errors.push('Tipo debe ser income o expense');
    }
    
    const validPeriodicities = ['7 day', '15 day', '30 day', '90 day', '365 day'];
    if (!validPeriodicities.includes(scheduleData.periodicity)) {
      errors.push('Periodicidad no válida');
    }
    
    if (!scheduleData.nextOccurrence) {
      errors.push('Fecha de próxima ocurrencia es requerida');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
