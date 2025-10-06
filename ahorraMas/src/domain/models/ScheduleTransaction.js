/**
 * Entidad ScheduleTransaction - Modelo de dominio
 * Representa una transacción programada con sus reglas de periodicidad
 */
export class ScheduleTransaction {
  constructor({
    id = null,
    type = 'expense',
    regularity = 'static',
    description = '',
    amount = 0,
    categoryId = null,
    periodicity = '30 day', // '7 day' | '15 day' | '30 day' | '90 day' | '365 day'
    nextOccurrence = null,
    endDate = null,
    status = true,
    userId = null,
    createdAt = null,
    updatedAt = null
  } = {}) {
    this.id = id;
    this.type = type;
    this.regularity = regularity;
    this.description = description;
    this.amount = Number(amount);
    this.categoryId = categoryId;
    this.periodicity = periodicity;
    this.nextOccurrence = nextOccurrence ? new Date(nextOccurrence) : null;
    this.endDate = endDate ? new Date(endDate) : null;
    this.status = status;
    this.userId = userId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Métodos de negocio
  isActive() {
    return this.status === true;
  }

  isIncome() {
    return this.type === 'income';
  }

  isExpense() {
    return this.type === 'expense';
  }

  // Validaciones
  isValid() {
    return this.description && 
           this.amount > 0 && 
           this.nextOccurrence &&
           ['income', 'expense'].includes(this.type) &&
           this.isValidPeriodicity();
  }

  isValidPeriodicity() {
    const validPeriodicities = ['7 day', '15 day', '30 day', '90 day', '365 day'];
    return validPeriodicities.includes(this.periodicity);
  }

  // Lógica de fechas
  isExpired() {
    if (!this.endDate) return false;
    return new Date() > this.endDate;
  }

  shouldExecuteToday() {
    if (!this.isActive() || this.isExpired()) return false;
    if (!this.nextOccurrence) return false;
    
    const today = new Date();
    const nextExecution = new Date(this.nextOccurrence);
    
    return today >= nextExecution;
  }

  calculateNextOccurrence() {
    if (!this.nextOccurrence) return null;
    
    const current = new Date(this.nextOccurrence);
    const days = this.getDaysFromPeriodicity();
    
    current.setDate(current.getDate() + days);
    return current;
  }

  getDaysFromPeriodicity() {
    const periodicityMap = {
      '7 day': 7,
      '15 day': 15,
      '30 day': 30,
      '90 day': 90,
      '365 day': 365
    };
    return periodicityMap[this.periodicity] || 30;
  }

  getPeriodicityLabel() {
    const labelMap = {
      '7 day': 'Semanal',
      '15 day': 'Quincenal',
      '30 day': 'Mensual',
      '90 day': 'Trimestral',
      '365 day': 'Anual'
    };
    return labelMap[this.periodicity] || this.periodicity;
  }

  // Factory methods
  static fromApiData(apiData) {
    return new ScheduleTransaction({
      id: apiData.id,
      type: apiData.type,
      regularity: apiData.regularity,
      description: apiData.description,
      amount: apiData.amount,
      categoryId: apiData.categoryId || apiData.category_id,
      periodicity: apiData.periodicity,
      nextOccurrence: apiData.nextOccurrence || apiData.next_occurrence,
      endDate: apiData.endDate || apiData.end_date,
      status: apiData.status !== undefined ? apiData.status : true,
      userId: apiData.userId || apiData.user_id,
      createdAt: apiData.createdAt ? new Date(apiData.createdAt) : null,
      updatedAt: apiData.updatedAt ? new Date(apiData.updatedAt) : null
    });
  }

  toApiData() {
    return {
      type: this.type,
      regularity: this.regularity,
      description: this.description,
      amount: this.amount,
      categoryId: this.categoryId,
      periodicity: this.periodicity,
      nextOccurrence: this.nextOccurrence ? this.nextOccurrence.toISOString().split('T')[0] : null,
      endDate: this.endDate ? this.endDate.toISOString().split('T')[0] : null,
      status: this.status
    };
  }

  // Convertir a transacción regular
  toTransaction() {
    return new Transaction({
      type: this.type,
      regularity: this.regularity,
      description: `${this.description} (Programada)`,
      amount: this.amount,
      categoryId: this.categoryId,
      userId: this.userId
    });
  }
}

// Importamos Transaction para el método toTransaction
import { Transaction } from './Transaction.js';
