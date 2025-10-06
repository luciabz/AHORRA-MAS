import { 
  ApiUserRepository,
  ApiCategoryRepository, 
  ApiTransactionRepository,
  ApiScheduleTransactionRepository,
  ApiGoalRepository 
} from '../infrastructure/repositories/index.js';

import { 
  UserUseCases,
  CategoryUseCases,
  TransactionUseCases,
  ScheduleTransactionUseCases,
  GoalUseCases
} from '../application/usecases/index.js';

/**
 * Container - Contenedor de inyección de dependencias
 * Configura e inicializa todos los casos de uso con sus respectivas dependencias
 */
class Container {
  constructor() {
    this._repositories = {};
    this._useCases = {};
    this._initialized = false;
  }

  /**
   * Inicializa todas las dependencias
   */
  init() {
    if (this._initialized) {
      return;
    }

    // Inicializar repositorios
    this._repositories.user = new ApiUserRepository();
    this._repositories.category = new ApiCategoryRepository();
    this._repositories.transaction = new ApiTransactionRepository();
    this._repositories.scheduleTransaction = new ApiScheduleTransactionRepository();
    this._repositories.goal = new ApiGoalRepository();

    // Inicializar casos de uso con inyección de dependencias
    this._useCases.user = new UserUseCases(this._repositories.user);
    this._useCases.category = new CategoryUseCases(this._repositories.category);
    this._useCases.transaction = new TransactionUseCases(this._repositories.transaction);
    this._useCases.scheduleTransaction = new ScheduleTransactionUseCases(this._repositories.scheduleTransaction);
    this._useCases.goal = new GoalUseCases(this._repositories.goal);

    this._initialized = true;
    console.log('🏗️ Container inicializado con Clean Architecture');
  }

  /**
   * Obtiene casos de uso de usuario
   */
  getUserUseCases() {
    this._ensureInitialized();
    return this._useCases.user;
  }

  /**
   * Obtiene casos de uso de categorías
   */
  getCategoryUseCases() {
    this._ensureInitialized();
    return this._useCases.category;
  }

  /**
   * Obtiene casos de uso de transacciones
   */
  getTransactionUseCases() {
    this._ensureInitialized();
    return this._useCases.transaction;
  }

  /**
   * Obtiene casos de uso de transacciones programadas
   */
  getScheduleTransactionUseCases() {
    this._ensureInitialized();
    return this._useCases.scheduleTransaction;
  }

  /**
   * Obtiene casos de uso de metas
   */
  getGoalUseCases() {
    this._ensureInitialized();
    return this._useCases.goal;
  }

  /**
   * Obtiene repositorio específico (para casos especiales)
   */
  getRepository(name) {
    this._ensureInitialized();
    return this._repositories[name];
  }

  /**
   * Resetea el contenedor (útil para reinicialización)
   */
  reset() {
    this._instance = null;
  }

  /**
   * Verifica que el contenedor esté inicializado
   */
  _ensureInitialized() {
    if (!this._initialized) {
      console.log('🔧 Inicializando container...');
      this.init();
      console.log('✅ Container inicializado exitosamente');
    }
  }
}

// Singleton instance
const container = new Container();

export default container;
