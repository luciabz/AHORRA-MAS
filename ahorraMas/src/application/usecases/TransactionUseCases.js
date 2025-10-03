import { CreateTransactionDTO, UpdateTransactionDTO, TransactionFilterDTO } from '../dto/TransactionDTO.js';
import { Transaction } from '../../domain/models/Transaction.js';

/**
 * CreateTransactionUseCase - Caso de uso para crear transacciones
 */
export class CreateTransactionUseCase {
  constructor(transactionRepository, categoryRepository) {
    this.transactionRepository = transactionRepository;
    this.categoryRepository = categoryRepository;
  }

  async execute(userId, transactionData) {
    // 1. Crear y validar DTO
    const dto = new CreateTransactionDTO(transactionData);
    const validation = dto.validate();
    
    if (!validation.isValid) {
      throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
    }

    // 2. Sanitizar datos
    const sanitizedData = dto.sanitize();

    // 3. Validar que la categoría existe (si se proporciona)
    if (sanitizedData.categoryId) {
      const category = await this.categoryRepository.findById(sanitizedData.categoryId);
      if (!category) {
        throw new Error('Categoría no encontrada');
      }
      
      // Verificar que el tipo de transacción coincide con el tipo de categoría
      if (category.type !== sanitizedData.type) {
        throw new Error('El tipo de transacción no coincide con el tipo de categoría');
      }
    }

    // 4. Crear entidad del dominio
    const transaction = new Transaction({
      ...sanitizedData,
      userId
    });

    // 5. Validaciones del dominio
    if (!transaction.isValid()) {
      throw new Error('Datos de transacción inválidos');
    }

    // 6. Guardar
    const createdTransaction = await this.transactionRepository.create(transaction);
    return Transaction.fromApiData(createdTransaction);
  }
}

/**
 * GetTransactionsUseCase - Caso de uso para obtener transacciones
 */
export class GetTransactionsUseCase {
  constructor(transactionRepository) {
    this.transactionRepository = transactionRepository;
  }

  async execute(userId, filters = {}) {
    // 1. Validar filtros si se proporcionan
    if (Object.keys(filters).length > 0) {
      const filterDTO = new TransactionFilterDTO(filters);
      const validation = filterDTO.validate();
      
      if (!validation.isValid) {
        throw new Error(`Filtros inválidos: ${validation.errors.join(', ')}`);
      }
      
      filters = filterDTO.getFilters();
    }

    // 2. Obtener transacciones
    const transactions = await this.transactionRepository.findByUserId(userId);
    
    // 3. Aplicar filtros localmente si es necesario
    let filteredTransactions = transactions;
    
    if (filters.type) {
      filteredTransactions = filteredTransactions.filter(t => t.type === filters.type);
    }
    
    if (filters.regularity) {
      filteredTransactions = filteredTransactions.filter(t => t.regularity === filters.regularity);
    }
    
    if (filters.categoryId) {
      filteredTransactions = filteredTransactions.filter(t => t.categoryId === filters.categoryId);
    }
    
    if (filters.startDate) {
      filteredTransactions = filteredTransactions.filter(t => 
        new Date(t.createdAt) >= filters.startDate
      );
    }
    
    if (filters.endDate) {
      filteredTransactions = filteredTransactions.filter(t => 
        new Date(t.createdAt) <= filters.endDate
      );
    }

    // 4. Convertir a entidades del dominio
    return filteredTransactions.map(t => Transaction.fromApiData(t));
  }
}

/**
 * UpdateTransactionUseCase - Caso de uso para actualizar transacciones
 */
export class UpdateTransactionUseCase {
  constructor(transactionRepository, categoryRepository) {
    this.transactionRepository = transactionRepository;
    this.categoryRepository = categoryRepository;
  }

  async execute(userId, transactionId, updateData) {
    // 1. Verificar que la transacción existe y pertenece al usuario
    const existingTransaction = await this.transactionRepository.findById(transactionId);
    if (!existingTransaction) {
      throw new Error('Transacción no encontrada');
    }
    
    if (existingTransaction.userId !== userId) {
      throw new Error('No tienes permisos para actualizar esta transacción');
    }

    // 2. Crear y validar DTO
    const dto = new UpdateTransactionDTO(updateData);
    const validation = dto.validate();
    
    if (!validation.isValid) {
      throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
    }

    // 3. Sanitizar datos
    const sanitizedData = dto.sanitize();

    // 4. Validar categoría si se actualiza
    if (sanitizedData.categoryId) {
      const category = await this.categoryRepository.findById(sanitizedData.categoryId);
      if (!category) {
        throw new Error('Categoría no encontrada');
      }
      
      const transactionType = sanitizedData.type || existingTransaction.type;
      if (category.type !== transactionType) {
        throw new Error('El tipo de transacción no coincide con el tipo de categoría');
      }
    }

    // 5. Actualizar
    const updatedTransaction = await this.transactionRepository.update(
      transactionId, 
      sanitizedData
    );
    
    return Transaction.fromApiData(updatedTransaction);
  }
}

/**
 * DeleteTransactionUseCase - Caso de uso para eliminar transacciones
 */
export class DeleteTransactionUseCase {
  constructor(transactionRepository) {
    this.transactionRepository = transactionRepository;
  }

  async execute(userId, transactionId) {
    // 1. Verificar que la transacción existe y pertenece al usuario
    const existingTransaction = await this.transactionRepository.findById(transactionId);
    if (!existingTransaction) {
      throw new Error('Transacción no encontrada');
    }
    
    if (existingTransaction.userId !== userId) {
      throw new Error('No tienes permisos para eliminar esta transacción');
    }

    // 2. Eliminar
    await this.transactionRepository.delete(transactionId);
    return true;
  }
}

/**
 * GetTransactionStatsUseCase - Caso de uso para estadísticas
 */
export class GetTransactionStatsUseCase {
  constructor(transactionRepository) {
    this.transactionRepository = transactionRepository;
  }

  async execute(userId, month = null, year = null) {
    // Si no se especifica mes/año, usar actual
    const currentDate = new Date();
    const targetMonth = month || currentDate.getMonth() + 1;
    const targetYear = year || currentDate.getFullYear();

    // Obtener totales por tipo
    const [incomeTotal, expenseTotal] = await Promise.all([
      this.transactionRepository.getTotalByType(userId, 'income'),
      this.transactionRepository.getTotalByType(userId, 'expense')
    ]);

    // Obtener totales mensuales
    const monthlyTotals = await this.transactionRepository.getMonthlyTotals(
      userId, 
      targetYear, 
      targetMonth
    );

    // Obtener totales por categoría
    const categoryTotals = await this.transactionRepository.getCategoryTotals(userId);

    return {
      totalIncome: incomeTotal || 0,
      totalExpenses: expenseTotal || 0,
      balance: (incomeTotal || 0) - (expenseTotal || 0),
      monthlyIncome: monthlyTotals.income || 0,
      monthlyExpenses: monthlyTotals.expenses || 0,
      monthlyBalance: (monthlyTotals.income || 0) - (monthlyTotals.expenses || 0),
      categoryBreakdown: categoryTotals || []
    };
  }
}

/**
 * TransactionUseCases - Clase principal que agrupa todos los casos de uso de transacciones
 */
export class TransactionUseCases {
  constructor(transactionRepository, categoryRepository = null) {
    this.transactionRepository = transactionRepository;
    this.categoryRepository = categoryRepository;
    
    // Inicializar casos de uso
    this.createTransaction = new CreateTransactionUseCase(transactionRepository, categoryRepository);
    this.getTransactions = new GetTransactionsUseCase(transactionRepository);
    this.updateTransaction = new UpdateTransactionUseCase(transactionRepository, categoryRepository);
    this.deleteTransaction = new DeleteTransactionUseCase(transactionRepository);
    this.getTransactionAnalytics = new GetTransactionStatsUseCase(transactionRepository);
  }

  /**
   * Crear una nueva transacción
   */
  async create(transactionData) {
    return await this.createTransaction.execute(transactionData);
  }

  /**
   * Obtener transacciones del usuario
   */
  async list(userId, filters = {}) {
    return await this.getTransactions.execute(userId, filters);
  }

  /**
   * Actualizar una transacción
   */
  async update(userId, transactionId, updateData) {
    return await this.updateTransaction.execute(userId, transactionId, updateData);
  }

  /**
   * Eliminar una transacción
   */
  async delete(userId, transactionId) {
    return await this.deleteTransaction.execute(userId, transactionId);
  }

  /**
   * Obtener analíticas de transacciones
   */
  async getAnalytics(userId, month = null, year = null) {
    return await this.getTransactionAnalytics.execute(userId, month, year);
  }
}
