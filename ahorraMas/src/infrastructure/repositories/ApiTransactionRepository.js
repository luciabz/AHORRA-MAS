import { TransactionRepository } from '../../domain/repositories/TransactionRepository.js';
import { Transaction } from '../../domain/models/Transaction.js';
import { TransactionApi } from '../api/transactionApi.js';

/**
 * ApiTransactionRepository - Implementación concreta del repositorio de transacciones
 * Utiliza TransactionApi para comunicación HTTP y añade lógica de dominio
 */
export class ApiTransactionRepository extends TransactionRepository {
  constructor() {
    super();
    this.transactionApi = TransactionApi;
  }

  /**
   * Convierte respuesta de API a modelo de dominio
   */
  _mapApiToModel(apiData) {
    if (!apiData) return null;
    
    return new Transaction(
      apiData.id,
      apiData.userId,
      apiData.categoryId,
      apiData.description,
      parseFloat(apiData.amount),
      apiData.type,
      apiData.date,
      apiData.createdAt,
      apiData.updatedAt
    );
  }

  /**
   * Convierte modelo de dominio a formato API
   */
  _mapModelToApi(transaction) {
    return {
      id: transaction.id,
      userId: transaction.userId,
      categoryId: transaction.categoryId,
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      date: transaction.date
    };
  }

  async create(transaction) {
    try {
      const token = this._getAuthToken();
      const apiData = this._mapModelToApi(transaction);
      const response = await this.transactionApi.create(apiData, token);
      return this._mapApiToModel(response);
    } catch (error) {
      this._handleApiError(error, 'Error creando transacción');
    }
  }

  async findById(id) {
    try {
      const token = this._getAuthToken();
      const response = await this.transactionApi.detail(id, token);
      return this._mapApiToModel(response);
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      this._handleApiError(error, 'Error obteniendo transacción');
    }
  }

  async findAll() {
    return this.findByUserId();
  }

  async findByUserId(userId = null) {
    try {
      const token = this._getAuthToken();
      const response = await this.transactionApi.list(token);
      return response.map(item => this._mapApiToModel(item));
    } catch (error) {
      this._handleApiError(error, 'Error obteniendo transacciones');
    }
  }

  async update(id, transactionData) {
    try {
      const token = this._getAuthToken();
      const response = await this.transactionApi.update(id, transactionData, token);
      return this._mapApiToModel(response);
    } catch (error) {
      this._handleApiError(error, 'Error actualizando transacción');
    }
  }

  async delete(id) {
    try {
      const token = this._getAuthToken();
      await this.transactionApi.remove(id, token);
      return true;
    } catch (error) {
      this._handleApiError(error, 'Error eliminando transacción');
    }
  }

  // Métodos específicos de consulta
  async findByType(userId, type) {
    const transactions = await this.findByUserId(userId);
    return transactions.filter(t => t.type === type);
  }

  async findByRegularity(userId, regularity) {
    const transactions = await this.findByUserId(userId);
    return transactions.filter(t => t.regularity === regularity);
  }

  async findByCategory(userId, categoryId) {
    const transactions = await this.findByUserId(userId);
    return transactions.filter(t => t.categoryId === categoryId);
  }

  async findByDateRange(userId, startDate, endDate) {
    const transactions = await this.findByUserId(userId);
    return transactions.filter(t => {
      const transactionDate = new Date(t.createdAt);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  }

  // Métodos de agregación
  async getTotalByType(userId, type) {
    const transactions = await this.findByType(userId, type);
    return transactions.reduce((total, t) => total + parseFloat(t.amount || 0), 0);
  }

  async getMonthlyTotals(userId, year, month) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    
    const transactions = await this.findByDateRange(userId, startDate, endDate);
    
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((total, t) => total + parseFloat(t.amount || 0), 0);
      
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((total, t) => total + parseFloat(t.amount || 0), 0);

    return { income, expenses };
  }

  async getCategoryTotals(userId) {
    const transactions = await this.findByUserId(userId);
    const categoryTotals = {};

    transactions.forEach(t => {
      const categoryId = t.categoryId || 'sin_categoria';
      if (!categoryTotals[categoryId]) {
        categoryTotals[categoryId] = {
          categoryId,
          income: 0,
          expense: 0,
          total: 0
        };
      }

      const amount = parseFloat(t.amount || 0);
      if (t.type === 'income') {
        categoryTotals[categoryId].income += amount;
        categoryTotals[categoryId].total += amount;
      } else {
        categoryTotals[categoryId].expense += amount;
        categoryTotals[categoryId].total -= amount;
      }
    });

    return Object.values(categoryTotals);
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

