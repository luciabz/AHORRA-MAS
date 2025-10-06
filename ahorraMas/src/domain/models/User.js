/**
 * Entidad User - Modelo de dominio
 * Representa un usuario del sistema con sus propiedades de negocio
 */
export class User {
  constructor({
    id = null,
    username = '',
    email = '',
    password = '',
    firstName = '',
    lastName = '',
    createdAt = null,
    updatedAt = null
  } = {}) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Métodos de negocio
  getFullName() {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  isValid() {
    return this.username && this.email && this.password;
  }

  // Validaciones de negocio
  validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  validatePassword() {
    // Mínimo 6 caracteres
    return this.password && this.password.length >= 6;
  }

  // Factory method para crear desde datos del API
  static fromApiData(apiData) {
    return new User({
      id: apiData.id,
      username: apiData.username,
      email: apiData.email,
      firstName: apiData.firstName || apiData.first_name,
      lastName: apiData.lastName || apiData.last_name,
      createdAt: apiData.createdAt ? new Date(apiData.createdAt) : null,
      updatedAt: apiData.updatedAt ? new Date(apiData.updatedAt) : null
    });
  }

  // Conversión para el API
  toApiData() {
    return {
      username: this.username,
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName
    };
  }
}
