/**
 * Entidad Goal - Modelo de dominio
 * Representa una meta de ahorro con sus reglas de negocio
 */
export class Goal {
  constructor({
    id = null,
    name = '',
    description = '',
    targetAmount = 0,
    currentAmount = 0,
    targetDate = null,
    priority = 'medium', // 'low' | 'medium' | 'high'
    status = 'active', // 'active' | 'completed' | 'paused'
    userId = null,
    createdAt = null,
    updatedAt = null
  } = {}) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.targetAmount = Number(targetAmount);
    this.currentAmount = Number(currentAmount);
    this.targetDate = targetDate ? new Date(targetDate) : null;
    this.priority = priority;
    this.status = status;
    this.userId = userId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Métodos de negocio - Cálculos
  getProgress() {
    if (this.targetAmount === 0) return 0;
    return Math.min((this.currentAmount / this.targetAmount) * 100, 100);
  }

  getRemainingAmount() {
    return Math.max(this.targetAmount - this.currentAmount, 0);
  }

  isCompleted() {
    return this.currentAmount >= this.targetAmount || this.status === 'completed';
  }

  isActive() {
    return this.status === 'active';
  }

  isPaused() {
    return this.status === 'paused';
  }

  // Validaciones
  isValid() {
    return this.name && 
           this.targetAmount > 0 && 
           this.currentAmount >= 0 &&
           ['low', 'medium', 'high'].includes(this.priority) &&
           ['active', 'completed', 'paused'].includes(this.status);
  }

  validateTargetAmount() {
    return this.targetAmount > 0 && !isNaN(this.targetAmount);
  }

  validateCurrentAmount() {
    return this.currentAmount >= 0 && !isNaN(this.currentAmount);
  }

  // Lógica de fechas
  getDaysRemaining() {
    if (!this.targetDate) return null;
    const today = new Date();
    const target = new Date(this.targetDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }

  isOverdue() {
    if (!this.targetDate) return false;
    return new Date() > this.targetDate && !this.isCompleted();
  }

  getRequiredMonthlySaving() {
    const remaining = this.getRemainingAmount();
    const daysRemaining = this.getDaysRemaining();
    
    if (!daysRemaining || daysRemaining <= 0) return remaining;
    
    const monthsRemaining = daysRemaining / 30;
    return remaining / monthsRemaining;
  }

  // Acciones de negocio
  addAmount(amount) {
    if (amount <= 0) throw new Error('El monto debe ser positivo');
    
    const newAmount = this.currentAmount + amount;
    this.currentAmount = Math.min(newAmount, this.targetAmount);
    
    // Auto-completar si se alcanza el objetivo
    if (this.currentAmount >= this.targetAmount && this.status === 'active') {
      this.status = 'completed';
    }
    
    this.updatedAt = new Date();
  }

  subtractAmount(amount) {
    if (amount <= 0) throw new Error('El monto debe ser positivo');
    
    this.currentAmount = Math.max(this.currentAmount - amount, 0);
    
    // Si estaba completado y ahora no, cambiar estado
    if (this.status === 'completed' && this.currentAmount < this.targetAmount) {
      this.status = 'active';
    }
    
    this.updatedAt = new Date();
  }

  markAsCompleted() {
    this.status = 'completed';
    this.updatedAt = new Date();
  }

  pause() {
    if (this.status === 'active') {
      this.status = 'paused';
      this.updatedAt = new Date();
    }
  }

  resume() {
    if (this.status === 'paused') {
      this.status = 'active';
      this.updatedAt = new Date();
    }
  }

  // Factory methods
  static fromApiData(apiData) {
    return new Goal({
      id: apiData.id,
      name: apiData.name,
      description: apiData.description,
      targetAmount: apiData.targetAmount || apiData.target_amount,
      currentAmount: apiData.currentAmount || apiData.current_amount || 0,
      targetDate: apiData.targetDate || apiData.target_date,
      priority: apiData.priority || 'medium',
      status: apiData.status || 'active',
      userId: apiData.userId || apiData.user_id,
      createdAt: apiData.createdAt ? new Date(apiData.createdAt) : null,
      updatedAt: apiData.updatedAt ? new Date(apiData.updatedAt) : null
    });
  }

  toApiData() {
    return {
      name: this.name,
      description: this.description,
      targetAmount: this.targetAmount,
      currentAmount: this.currentAmount,
      targetDate: this.targetDate ? this.targetDate.toISOString().split('T')[0] : null,
      priority: this.priority,
      status: this.status
    };
  }

  // Métodos de formato
  getFormattedTargetAmount() {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(this.targetAmount);
  }

  getFormattedCurrentAmount() {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(this.currentAmount);
  }

  getPriorityLabel() {
    const labels = {
      'low': 'Baja',
      'medium': 'Media',
      'high': 'Alta'
    };
    return labels[this.priority] || this.priority;
  }

  getStatusLabel() {
    const labels = {
      'active': 'Activa',
      'completed': 'Completada',
      'paused': 'Pausada'
    };
    return labels[this.status] || this.status;
  }
}
