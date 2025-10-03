/**
 * CategoryRepository - Interfaz del repositorio de categorías
 * Define el contrato para el manejo de categorías
 */
export class CategoryRepository {
  constructor() {
    if (this.constructor === CategoryRepository) {
      throw new Error('CategoryRepository es una clase abstracta');
    }
  }

  // Operaciones CRUD básicas
  async create(category) {
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

  async update(id, categoryData) {
    throw new Error('Método update() debe ser implementado');
  }

  async delete(id) {
    throw new Error('Método delete() debe ser implementado');
  }

  // Consultas específicas
  async findByType(userId, type) {
    throw new Error('Método findByType() debe ser implementado');
  }

  async findByName(userId, name) {
    throw new Error('Método findByName() debe ser implementado');
  }

  // Validaciones de reglas de negocio
  async canDelete(id) {
    throw new Error('Método canDelete() debe ser implementado');
  }

  async isNameUnique(userId, name, excludeId = null) {
    throw new Error('Método isNameUnique() debe ser implementado');
  }

  // Validaciones
  validateCategoryData(categoryData) {
    const errors = [];
    
    if (!categoryData.name || categoryData.name.trim().length < 2) {
      errors.push('Nombre debe tener al menos 2 caracteres');
    }
    
    if (!['income', 'expense'].includes(categoryData.type)) {
      errors.push('Tipo debe ser income o expense');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
