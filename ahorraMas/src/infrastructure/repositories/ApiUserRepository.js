import { UserRepository } from '../../domain/repositories/UserRepository.js';
import { User } from '../../domain/models/User.js';
import { UserApi } from '../api/userApi.js';

/**
 * ApiUserRepository - Implementación concreta del repositorio de usuarios
 * Utiliza UserApi para comunicación HTTP y añade lógica de dominio
 */
export class ApiUserRepository extends UserRepository {
  constructor() {
    super();
    this.userApi = UserApi;
  }

  /**
   * Convierte respuesta de API a modelo de dominio
   */
  _mapApiToModel(apiData) {
    if (!apiData) return null;
    
    return new User(
      apiData.id,
      apiData.username,
      apiData.email,
      apiData.firstName,
      apiData.lastName,
      apiData.avatar,
      apiData.isActive,
      apiData.createdAt,
      apiData.updatedAt
    );
  }

  /**
   * Convierte modelo de dominio a formato API
   */
  _mapModelToApi(user) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      isActive: user.isActive
    };
  }

  async create(user) {
    try {
      // Para crear usuario, normalmente se usa un endpoint de registro separado
      // Esta implementación asume que UserApi.create existe o se maneja diferente
      const userData = this._mapModelToApi(user);
      const response = await this.userApi.create?.(userData) || null;
      return response ? this._mapApiToModel(response) : null;
    } catch (error) {
      this._handleApiError(error, 'Error creando usuario');
    }
  }

  async findById(id) {
    try {
      // Esta funcionalidad podría no estar disponible en UserApi básico
      // Se implementaría si el backend la soporta
      return null;
    } catch (error) {
      this._handleApiError(error, 'Error obteniendo usuario por ID');
    }
  }

  async findByEmail(email) {
    try {
      // Esta funcionalidad podría no estar disponible en UserApi básico
      // Se implementaría si el backend la soporta
      return null;
    } catch (error) {
      this._handleApiError(error, 'Error buscando usuario por email');
    }
  }

  async findByUsername(username) {
    try {
      // Esta funcionalidad podría no estar disponible en UserApi básico
      // Se implementaría si el backend la soporta
      return null;
    } catch (error) {
      this._handleApiError(error, 'Error buscando usuario por username');
    }
  }

  async update(id, userData) {
    try {
      const token = this._getAuthToken();
      const response = await this.userApi.updateProfile(userData, token);
      return this._mapApiToModel(response);
    } catch (error) {
      this._handleApiError(error, 'Error actualizando usuario');
    }
  }

  async delete(id) {
    try {
      const token = this._getAuthToken();
      await this.userApi.deleteAccount(token);
      return true;
    } catch (error) {
      this._handleApiError(error, 'Error eliminando usuario');
    }
  }

  async authenticate(email, password) {
    try {
      // La autenticación normalmente se maneja en un servicio separado
      // Esta implementación es conceptual
      return {
        success: false,
        message: 'Autenticación debe manejarse en AuthService'
      };
    } catch (error) {
      this._handleApiError(error, 'Error en autenticación');
    }
  }

  async findAll() {
    try {
      // Esta funcionalidad normalmente requiere permisos de administrador
      // No está disponible en UserApi básico
      return [];
    } catch (error) {
      this._handleApiError(error, 'Error obteniendo usuarios');
    }
  }

  async getCurrentUser() {
    try {
      const token = this._getAuthToken();
      const response = await this.userApi.me(token);
      return this._mapApiToModel(response);
    } catch (error) {
      this._handleApiError(error, 'Error obteniendo usuario actual');
    }
  }

  async changePassword(oldPassword, newPassword) {
    try {
      const token = this._getAuthToken();
      const response = await this.userApi.changePassword({
        oldPassword,
        newPassword
      }, token);
      return response;
    } catch (error) {
      this._handleApiError(error, 'Error cambiando contraseña');
    }
  }

  async getStatistics() {
    try {
      const token = this._getAuthToken();
      const response = await this.userApi.getStatistics(token);
      return response;
    } catch (error) {
      this._handleApiError(error, 'Error obteniendo estadísticas de usuario');
    }
  }

  // Métodos auxiliares privados
  _getAuthToken() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }
    return token;
  }

  _handleApiError(error, defaultMessage) {
    console.error('API Error:', error);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
    }
    
    if (error.response?.status === 403) {
      throw new Error('No tienes permisos para realizar esta acción.');
    }
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    if (error.response?.data?.errors) {
      const errors = Object.values(error.response.data.errors).flat();
      throw new Error(errors.join(', '));
    }
    
    if (error.message) {
      throw new Error(error.message);
    }
    
    throw new Error(defaultMessage);
  }
}
