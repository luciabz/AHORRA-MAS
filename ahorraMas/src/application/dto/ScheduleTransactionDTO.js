/**
 * CreateScheduleTransactionDTO - Data Transfer Object para transacciones programadas
 */
export class CreateScheduleTransactionDTO {
  constructor({
    type,
    regularity,
    description,
    amount,
    categoryId,
    periodicity,
    nextOccurrence,
    endDate = null
  }) {
    this.type = type;
    this.regularity = regularity;
    this.description = description;
    this.amount = parseFloat(amount);
    this.categoryId = categoryId;
    this.periodicity = periodicity;
    this.nextOccurrence = nextOccurrence ? new Date(nextOccurrence) : null;
    this.endDate = endDate ? new Date(endDate) : null;
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

    const validPeriodicities = ['7 day', '15 day', '30 day', '90 day', '365 day'];
    if (!validPeriodicities.includes(this.periodicity)) {
      errors.push('Periodicidad no válida');
    }

    if (!this.nextOccurrence || this.nextOccurrence <= new Date()) {
      errors.push('Fecha de próxima ocurrencia debe ser futura');
    }

    if (this.endDate && this.endDate <= new Date()) {
      errors.push('Fecha de fin debe ser futura');
    }

    if (this.nextOccurrence && this.endDate && this.nextOccurrence >= this.endDate) {
      errors.push('Próxima ocurrencia debe ser anterior a fecha de fin');
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
      categoryId: this.categoryId || null,
      periodicity: this.periodicity,
      nextOccurrence: this.nextOccurrence.toISOString().split('T')[0],
      endDate: this.endDate ? this.endDate.toISOString().split('T')[0] : null,
      status: true
    };
  }
}

/**
 * UpdateScheduleTransactionDTO - Para actualizaciones
 */
export class UpdateScheduleTransactionDTO {
  constructor({
    type,
    regularity,
    description,
    amount,
    categoryId,
    periodicity,
    nextOccurrence,
    endDate,
    status
  }) {
    this.type = type;
    this.regularity = regularity;
    this.description = description;
    this.amount = amount !== undefined ? parseFloat(amount) : undefined;
    this.categoryId = categoryId;
    this.periodicity = periodicity;
    this.nextOccurrence = nextOccurrence ? new Date(nextOccurrence) : undefined;
    this.endDate = endDate ? new Date(endDate) : undefined;
    this.status = status;
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

    const validPeriodicities = ['7 day', '15 day', '30 day', '90 day', '365 day'];
    if (this.periodicity && !validPeriodicities.includes(this.periodicity)) {
      errors.push('Periodicidad no válida');
    }

    if (this.nextOccurrence && this.endDate && this.nextOccurrence >= this.endDate) {
      errors.push('Próxima ocurrencia debe ser anterior a fecha de fin');
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
    if (this.periodicity !== undefined) data.periodicity = this.periodicity;
    if (this.nextOccurrence !== undefined) data.nextOccurrence = this.nextOccurrence.toISOString().split('T')[0];
    if (this.endDate !== undefined) data.endDate = this.endDate ? this.endDate.toISOString().split('T')[0] : null;
    if (this.status !== undefined) data.status = this.status;
    return data;
  }
}
