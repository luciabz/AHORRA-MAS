/**
 * TransactionRepository - Interfaz del repositorio de transacciones
 * Define el contrato para el manejo de transacciones
 */
export class TransactionRepository {
  constructor() {
    if (this.constructor === TransactionRepository) {
      throw new Error('TransactionRepository es una clase abstracta');
    }
  }

  // Operaciones CRUD básicas
  async create(transaction) {
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

  async update(id, transactionData) {
    throw new Error('Método update() debe ser implementado');
  }

  async delete(id) {
    throw new Error('Método delete() debe ser implementado');
  }

  // Consultas específicas de negocio
  async findByType(userId, type) {
    throw new Error('Método findByType() debe ser implementado');
  }

  async findByRegularity(userId, regularity) {
    throw new Error('Método findByRegularity() debe ser implementado');
  }

  async findByCategory(userId, categoryId) {
    throw new Error('Método findByCategory() debe ser implementado');
  }

  async findByDateRange(userId, startDate, endDate) {
    throw new Error('Método findByDateRange() debe ser implementado');
  }

  // Métodos de agregación
  async getTotalByType(userId, type) {
    throw new Error('Método getTotalByType() debe ser implementado');
  }

  async getMonthlyTotals(userId, year, month) {
    throw new Error('Método getMonthlyTotals() debe ser implementado');
  }

  async getCategoryTotals(userId) {
    throw new Error('Método getCategoryTotals() debe ser implementado');
  }

  // Validaciones específicas del dominio
  validateTransactionData(transactionData) {
    const errors = [];
    
    if (!transactionData.description || transactionData.description.trim().length < 3) {
      errors.push('Descripción debe tener al menos 3 caracteres');
    }
    
    if (!transactionData.amount || transactionData.amount <= 0) {
      errors.push('El monto debe ser mayor a 0');
    }
    
    if (!['income', 'expense'].includes(transactionData.type)) {
      errors.push('Tipo debe ser income o expense');
    }
    
    if (!['static', 'variable'].includes(transactionData.regularity)) {
      errors.push('Regularidad debe ser static o variable');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
