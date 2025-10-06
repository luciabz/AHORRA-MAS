/**
 * CreateTransactionDTO - Data Transfer Object para crear transacciones
 */
export class CreateTransactionDTO {
  constructor({
    type,
    regularity,
    description,
    amount,
    categoryId
  }) {
    this.type = type;
    this.regularity = regularity;
    this.description = description;
    this.amount = parseFloat(amount);
    this.categoryId = categoryId;
  }

  validate() {
    const errors = [];

    if (!['income', 'expense'].includes(this.type)) {
      errors.push('Tipo debe ser income o expense');
    }

    if (!['static', 'variable'].includes(this.regularity)) {
      errors.push('Regularidad debe ser static o variable');
    }

    if (!this.description || this.description.trim().length < 3) {
      errors.push('Descripción debe tener al menos 3 caracteres');
    }

    if (isNaN(this.amount) || this.amount <= 0) {
      errors.push('Monto debe ser un número mayor a 0');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  sanitize() {
    return {
      type: this.type,
      regularity: this.regularity,
      description: this.description.trim(),
      amount: this.amount,
      categoryId: this.categoryId || null
    };
  }
}

/**
 * UpdateTransactionDTO - Para actualizaciones
 */
export class UpdateTransactionDTO {
  constructor({
    type,
    regularity,
    description,
    amount,
    categoryId
  }) {
    this.type = type;
    this.regularity = regularity;
    this.description = description;
    this.amount = amount !== undefined ? parseFloat(amount) : undefined;
    this.categoryId = categoryId;
  }

  validate() {
    const errors = [];

    if (this.type && !['income', 'expense'].includes(this.type)) {
      errors.push('Tipo debe ser income o expense');
    }

    if (this.regularity && !['static', 'variable'].includes(this.regularity)) {
      errors.push('Regularidad debe ser static o variable');
    }

    if (this.description && this.description.trim().length < 3) {
      errors.push('Descripción debe tener al menos 3 caracteres');
    }

    if (this.amount !== undefined && (isNaN(this.amount) || this.amount <= 0)) {
      errors.push('Monto debe ser un número mayor a 0');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  sanitize() {
    const data = {};
    if (this.type !== undefined) data.type = this.type;
    if (this.regularity !== undefined) data.regularity = this.regularity;
    if (this.description !== undefined) data.description = this.description.trim();
    if (this.amount !== undefined) data.amount = this.amount;
    if (this.categoryId !== undefined) data.categoryId = this.categoryId;
    return data;
  }
}

/**
 * TransactionFilterDTO - Para filtros y búsquedas
 */
export class TransactionFilterDTO {
  constructor({
    type = null,
    regularity = null,
    categoryId = null,
    startDate = null,
    endDate = null,
    minAmount = null,
    maxAmount = null,
    description = null
  } = {}) {
    this.type = type;
    this.regularity = regularity;
    this.categoryId = categoryId;
    this.startDate = startDate ? new Date(startDate) : null;
    this.endDate = endDate ? new Date(endDate) : null;
    this.minAmount = minAmount !== null ? parseFloat(minAmount) : null;
    this.maxAmount = maxAmount !== null ? parseFloat(maxAmount) : null;
    this.description = description;
  }

  validate() {
    const errors = [];

    if (this.type && !['income', 'expense'].includes(this.type)) {
      errors.push('Tipo debe ser income o expense');
    }

    if (this.regularity && !['static', 'variable'].includes(this.regularity)) {
      errors.push('Regularidad debe ser static o variable');
    }

    if (this.startDate && this.endDate && this.startDate > this.endDate) {
      errors.push('Fecha de inicio debe ser anterior a fecha de fin');
    }

    if (this.minAmount !== null && (isNaN(this.minAmount) || this.minAmount < 0)) {
      errors.push('Monto mínimo debe ser mayor o igual a 0');
    }

    if (this.maxAmount !== null && (isNaN(this.maxAmount) || this.maxAmount < 0)) {
      errors.push('Monto máximo debe ser mayor o igual a 0');
    }

    if (this.minAmount !== null && this.maxAmount !== null && this.minAmount > this.maxAmount) {
      errors.push('Monto mínimo debe ser menor o igual al máximo');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  getFilters() {
    const filters = {};
    
    if (this.type) filters.type = this.type;
    if (this.regularity) filters.regularity = this.regularity;
    if (this.categoryId) filters.categoryId = this.categoryId;
    if (this.startDate) filters.startDate = this.startDate;
    if (this.endDate) filters.endDate = this.endDate;
    if (this.minAmount !== null) filters.minAmount = this.minAmount;
    if (this.maxAmount !== null) filters.maxAmount = this.maxAmount;
    if (this.description) filters.description = this.description.trim();
    
    return filters;
  }
}
