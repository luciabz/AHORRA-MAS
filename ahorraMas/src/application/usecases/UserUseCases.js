import { CreateUserDTO, UpdateUserDTO, LoginDTO } from '../dto/UserDTO.js';
import { User } from '../../domain/models/User.js';

/**
 * CreateUserUseCase - Caso de uso para crear usuarios
 * Encapsula la lógica de negocio para la creación de usuarios
 */
export class CreateUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userData) {
    // 1. Crear y validar DTO
    const dto = new CreateUserDTO(userData);
    const validation = dto.validate();
    
    if (!validation.isValid) {
      throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
    }

    // 2. Sanitizar datos
    const sanitizedData = dto.sanitize();

    // 3. Verificar unicidad del email
    const existingUserByEmail = await this.userRepository.findByEmail(sanitizedData.email);
    if (existingUserByEmail) {
      throw new Error('Ya existe un usuario con este email');
    }

    // 4. Verificar unicidad del username
    const existingUserByUsername = await this.userRepository.findByUsername(sanitizedData.username);
    if (existingUserByUsername) {
      throw new Error('Ya existe un usuario con este username');
    }

    // 5. Crear entidad del dominio
    const user = new User(sanitizedData);

    // 6. Validaciones adicionales del dominio
    if (!user.isValid()) {
      throw new Error('Datos de usuario inválidos');
    }

    if (!user.validateEmail()) {
      throw new Error('Email inválido');
    }

    if (!user.validatePassword()) {
      throw new Error('Password debe tener al menos 6 caracteres');
    }

    // 7. Guardar en repositorio
    const createdUser = await this.userRepository.create(user);
    return User.fromApiData(createdUser);
  }
}

/**
 * AuthenticateUserUseCase - Caso de uso para autenticación
 */
export class AuthenticateUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(loginData) {
    // 1. Crear y validar DTO
    const dto = new LoginDTO(loginData);
    const validation = dto.validate();
    
    if (!validation.isValid) {
      throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
    }

    // 2. Sanitizar datos
    const sanitizedData = dto.sanitize();

    // 3. Autenticar
    const result = await this.userRepository.authenticate(
      sanitizedData.email, 
      sanitizedData.password
    );

    if (!result.success) {
      throw new Error('Credenciales inválidas');
    }

    return {
      user: User.fromApiData(result.user),
      token: result.token
    };
  }
}

/**
 * GetUserUseCase - Caso de uso para obtener un usuario
 */
export class GetUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId) {
    if (!userId) {
      throw new Error('ID de usuario requerido');
    }

    const userData = await this.userRepository.findById(userId);
    if (!userData) {
      throw new Error('Usuario no encontrado');
    }

    return User.fromApiData(userData);
  }
}

/**
 * UpdateUserUseCase - Caso de uso para actualizar usuario
 */
export class UpdateUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId, updateData) {
    // 1. Validar que el usuario existe
    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new Error('Usuario no encontrado');
    }

    // 2. Crear y validar DTO
    const dto = new UpdateUserDTO(updateData);
    const validation = dto.validate();
    
    if (!validation.isValid) {
      throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
    }

    // 3. Sanitizar datos
    const sanitizedData = dto.sanitize();

    // 4. Si se actualiza el email, verificar unicidad
    if (sanitizedData.email) {
      const existingUserByEmail = await this.userRepository.findByEmail(sanitizedData.email);
      if (existingUserByEmail && existingUserByEmail.id !== userId) {
        throw new Error('Ya existe un usuario con este email');
      }
    }

    // 5. Actualizar
    const updatedUser = await this.userRepository.update(userId, sanitizedData);
    return User.fromApiData(updatedUser);
  }
}

/**
 * UserUseCases - Clase principal que agrupa todos los casos de uso de usuarios
 */
export class UserUseCases {
  constructor(userRepository) {
    this.userRepository = userRepository;
    
    // Inicializar casos de uso
    this.createUser = new CreateUserUseCase(userRepository);
    this.loginUser = new AuthenticateUserUseCase(userRepository);
    this.getUserProfile = new GetUserUseCase(userRepository);
    this.updateUserProfile = new UpdateUserUseCase(userRepository);
  }

  /**
   * Crear un nuevo usuario
   */
  async register(userData) {
    return await this.createUser.execute(userData);
  }

  /**
   * Iniciar sesión de usuario
   */
  async login(credentials) {
    return await this.loginUser.execute(credentials);
  }

  /**
   * Obtener perfil de usuario
   */
  async getProfile(userId) {
    return await this.getUserProfile.execute(userId);
  }

  /**
   * Actualizar perfil de usuario
   */
  async updateProfile(userId, updateData) {
    return await this.updateUserProfile.execute(userId, updateData);
  }
}
