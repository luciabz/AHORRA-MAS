/**
 * Entidad Category - Modelo de dominio
 * Representa una categoría de transacción con sus reglas de negocio
 */
export class Category {
  constructor({
    id = null,
    name = '',
    description = '',
    type = 'expense', // 'income' | 'expense'
    userId = null,
    createdAt = null,
    updatedAt = null
  } = {}) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.type = type;
    this.userId = userId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Métodos de negocio
  isIncomeCategory() {
    return this.type === 'income';
  }

  isExpenseCategory() {
    return this.type === 'expense';
  }

  isValid() {
    return this.name && this.type && ['income', 'expense'].includes(this.type);
  }

  // Validaciones específicas
  validateName() {
    return this.name && this.name.trim().length >= 2;
  }

  // Factory methods
  static fromApiData(apiData) {
    return new Category({
      id: apiData.id,
      name: apiData.name,
      description: apiData.description,
      type: apiData.type,
      userId: apiData.userId || apiData.user_id,
      createdAt: apiData.createdAt ? new Date(apiData.createdAt) : null,
      updatedAt: apiData.updatedAt ? new Date(apiData.updatedAt) : null
    });
  }

  toApiData() {
    return {
      name: this.name,
      description: this.description,
      type: this.type
    };
  }

  // Método para crear categorías por defecto
  static createDefaultCategories() {
    return [
      new Category({ name: 'Salario', type: 'income', description: 'Ingresos por trabajo' }),
      new Category({ name: 'Freelance', type: 'income', description: 'Trabajos independientes' }),
      new Category({ name: 'Alimentación', type: 'expense', description: 'Gastos en comida' }),
      new Category({ name: 'Transporte', type: 'expense', description: 'Gastos de transporte' }),
      new Category({ name: 'Entretenimiento', type: 'expense', description: 'Gastos de ocio' })
    ];
  }
}
