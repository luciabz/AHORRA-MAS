/**
 * UserRepository - Interfaz del repositorio de usuarios
 * Define el contrato que debe cumplir cualquier implementación
 * Esta es una abstracción que no depende de detalles de implementación
 */
export class UserRepository {
  constructor() {
    if (this.constructor === UserRepository) {
      throw new Error('UserRepository es una clase abstracta');
    }
  }

  // Métodos que debe implementar cualquier repositorio de usuarios
  async create(user) {
    throw new Error('Método create() debe ser implementado');
  }

  async findById(id) {
    throw new Error('Método findById() debe ser implementado');
  }

  async findByEmail(email) {
    throw new Error('Método findByEmail() debe ser implementado');
  }

  async findByUsername(username) {
    throw new Error('Método findByUsername() debe ser implementado');
  }

  async update(id, userData) {
    throw new Error('Método update() debe ser implementado');
  }

  async delete(id) {
    throw new Error('Método delete() debe ser implementado');
  }

  async authenticate(email, password) {
    throw new Error('Método authenticate() debe ser implementado');
  }

  async findAll() {
    throw new Error('Método findAll() debe ser implementado');
  }

  // Validaciones que pueden ser comunes
  validateUserData(userData) {
    const errors = [];
    
    if (!userData.email) {
      errors.push('Email es requerido');
    }
    
    if (!userData.username) {
      errors.push('Username es requerido');
    }
    
    if (!userData.password || userData.password.length < 6) {
      errors.push('Password debe tener al menos 6 caracteres');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
