/**
 * CreateCategoryDTO - Data Transfer Object para crear categorías
 */
export class CreateCategoryDTO {
  constructor({
    name,
    description = '',
    type
  }) {
    this.name = name;
    this.description = description;
    this.type = type;
  }

  validate() {
    const errors = [];

    if (!this.name || this.name.trim().length < 2) {
      errors.push('Nombre debe tener al menos 2 caracteres');
    }

    if (!['income', 'expense'].includes(this.type)) {
      errors.push('Tipo debe ser income o expense');
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
      type: this.type
    };
  }
}

/**
 * UpdateCategoryDTO - Para actualizaciones de categorías
 */
export class UpdateCategoryDTO {
  constructor({
    name,
    description,
    type
  }) {
    this.name = name;
    this.description = description;
    this.type = type;
  }

  validate() {
    const errors = [];

    if (this.name && this.name.trim().length < 2) {
      errors.push('Nombre debe tener al menos 2 caracteres');
    }

    if (this.type && !['income', 'expense'].includes(this.type)) {
      errors.push('Tipo debe ser income o expense');
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
    if (this.type !== undefined) data.type = this.type;
    return data;
  }
}
