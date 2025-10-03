/**
 * CreateUserDTO - Data Transfer Object para crear usuarios
 * Encapsula los datos necesarios para crear un usuario
 */
export class CreateUserDTO {
  constructor({
    username,
    email,
    password,
    firstName = '',
    lastName = ''
  }) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  // Validación de entrada
  validate() {
    const errors = [];

    if (!this.username || this.username.trim().length < 3) {
      errors.push('Username debe tener al menos 3 caracteres');
    }

    if (!this.email || !this.isValidEmail(this.email)) {
      errors.push('Email debe ser válido');
    }

    if (!this.password || this.password.length < 6) {
      errors.push('Password debe tener al menos 6 caracteres');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Sanitizar datos
  sanitize() {
    return {
      username: this.username.trim().toLowerCase(),
      email: this.email.trim().toLowerCase(),
      password: this.password,
      firstName: this.firstName.trim(),
      lastName: this.lastName.trim()
    };
  }
}

/**
 * UpdateUserDTO - Para actualizaciones de usuario
 */
export class UpdateUserDTO {
  constructor({
    firstName,
    lastName,
    email
  }) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }

  validate() {
    const errors = [];

    if (this.email && !this.isValidEmail(this.email)) {
      errors.push('Email debe ser válido');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  sanitize() {
    const data = {};
    if (this.firstName !== undefined) data.firstName = this.firstName.trim();
    if (this.lastName !== undefined) data.lastName = this.lastName.trim();
    if (this.email !== undefined) data.email = this.email.trim().toLowerCase();
    return data;
  }
}

/**
 * LoginDTO - Para autenticación
 */
export class LoginDTO {
  constructor({ email, password }) {
    this.email = email;
    this.password = password;
  }

  validate() {
    const errors = [];

    if (!this.email) {
      errors.push('Email es requerido');
    }

    if (!this.password) {
      errors.push('Password es requerido');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  sanitize() {
    return {
      email: this.email.trim().toLowerCase(),
      password: this.password
    };
  }
}
