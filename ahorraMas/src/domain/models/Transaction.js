/**
 * Entidad Transaction - Modelo de dominio
 * Representa una transacción financiera con sus reglas de negocio
 */
export class Transaction {
  constructor({
    id = null,
    type = 'expense', // 'income' | 'expense'
    regularity = 'variable', // 'static' | 'variable'
    description = '',
    amount = 0,
    categoryId = null,
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
    this.userId = userId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Métodos de negocio
  isIncome() {
    return this.type === 'income';
  }

  isExpense() {
    return this.type === 'expense';
  }

  isStatic() {
    return this.regularity === 'static';
  }

  isVariable() {
    return this.regularity === 'variable';
  }

  // Validaciones de negocio
  isValid() {
    return this.description && 
           this.amount > 0 && 
           ['income', 'expense'].includes(this.type) &&
           ['static', 'variable'].includes(this.regularity);
  }

  validateAmount() {
    return this.amount > 0 && !isNaN(this.amount);
  }

  validateDescription() {
    return this.description && this.description.trim().length >= 3;
  }

  // Cálculos de negocio
  getSignedAmount() {
    return this.isIncome() ? this.amount : -this.amount;
  }

  getFormattedAmount() {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(this.amount);
  }

  // Factory methods
  static fromApiData(apiData) {
    return new Transaction({
      id: apiData.id,
      type: apiData.type,
      regularity: apiData.regularity,
      description: apiData.description || apiData.descripcion,
      amount: apiData.amount || apiData.monto,
      categoryId: apiData.categoryId || apiData.category_id,
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
      categoryId: this.categoryId
    };
  }

  // Métodos utilitarios
  clone() {
    return new Transaction({
      id: this.id,
      type: this.type,
      regularity: this.regularity,
      description: this.description,
      amount: this.amount,
      categoryId: this.categoryId,
      userId: this.userId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    });
  }
}
