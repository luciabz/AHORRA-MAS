/**
 * CreateGoalDTO - Data Transfer Object para crear metas
 */
export class CreateGoalDTO {
  constructor({
    name,
    description = '',
    targetAmount,
    targetDate = null,
    priority = 'medium'
  }) {
    this.name = name;
    this.description = description;
    this.targetAmount = parseFloat(targetAmount);
    this.targetDate = targetDate ? new Date(targetDate) : null;
    this.priority = priority;
  }

  validate() {
    const errors = [];

    if (!this.name || this.name.trim().length < 2) {
      errors.push('Nombre debe tener al menos 2 caracteres');
    }

    if (isNaN(this.targetAmount) || this.targetAmount <= 0) {
      errors.push('Monto objetivo debe ser mayor a 0');
    }

    if (!['low', 'medium', 'high'].includes(this.priority)) {
      errors.push('Prioridad debe ser low, medium o high');
    }

    if (this.targetDate && this.targetDate <= new Date()) {
      errors.push('Fecha objetivo debe ser futura');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  sanitize() {
    return {
      name: this.name.trim(),
      description: this.description.trim(),
      targetAmount: this.targetAmount,
      currentAmount: 0,
      targetDate: this.targetDate ? this.targetDate.toISOString().split('T')[0] : null,
      priority: this.priority,
      status: 'active'
    };
  }
}

/**
 * UpdateGoalDTO - Para actualizaciones de metas
 */
export class UpdateGoalDTO {
  constructor({
    name,
    description,
    targetAmount,
    currentAmount,
    targetDate,
    priority,
    status
  }) {
    this.name = name;
    this.description = description;
    this.targetAmount = targetAmount !== undefined ? parseFloat(targetAmount) : undefined;
    this.currentAmount = currentAmount !== undefined ? parseFloat(currentAmount) : undefined;
    this.targetDate = targetDate ? new Date(targetDate) : undefined;
    this.priority = priority;
    this.status = status;
  }

  validate() {
    const errors = [];

    if (this.name && this.name.trim().length < 2) {
      errors.push('Nombre debe tener al menos 2 caracteres');
    }

    if (this.targetAmount !== undefined && (isNaN(this.targetAmount) || this.targetAmount <= 0)) {
      errors.push('Monto objetivo debe ser mayor a 0');
    }

    if (this.currentAmount !== undefined && (isNaN(this.currentAmount) || this.currentAmount < 0)) {
      errors.push('Monto actual no puede ser negativo');
    }

    if (this.priority && !['low', 'medium', 'high'].includes(this.priority)) {
      errors.push('Prioridad debe ser low, medium o high');
    }

    if (this.status && !['active', 'completed', 'paused'].includes(this.status)) {
      errors.push('Estado debe ser active, completed o paused');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  sanitize() {
    const data = {};
    if (this.name !== undefined) data.name = this.name.trim();
    if (this.description !== undefined) data.description = this.description.trim();
    if (this.targetAmount !== undefined) data.targetAmount = this.targetAmount;
    if (this.currentAmount !== undefined) data.currentAmount = this.currentAmount;
    if (this.targetDate !== undefined) data.targetDate = this.targetDate ? this.targetDate.toISOString().split('T')[0] : null;
    if (this.priority !== undefined) data.priority = this.priority;
    if (this.status !== undefined) data.status = this.status;
    return data;
  }
}

/**
 * AddToGoalDTO - Para agregar dinero a una meta
 */
export class AddToGoalDTO {
  constructor({ amount, description = '' }) {
    this.amount = parseFloat(amount);
    this.description = description;
  }

  validate() {
    const errors = [];

    if (isNaN(this.amount) || this.amount <= 0) {
      errors.push('Monto debe ser mayor a 0');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  sanitize() {
    return {
      amount: this.amount,
      description: this.description.trim()
    };
  }
}
