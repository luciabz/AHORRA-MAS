import { ScheduleTransaction } from '../models/ScheduleTransaction.js';

/**
 * ScheduleService - Servicio de dominio para gestión de transacciones programadas
 * Maneja la lógica compleja de programación y ejecución de transacciones
 */
export class ScheduleService {

  /**
   * Calcula la próxima fecha de ejecución basada en la frecuencia
   */
  static calculateNextExecution(scheduleTransaction) {
    if (!scheduleTransaction.isActive) return null;

    const now = new Date();
    const lastExecution = new Date(scheduleTransaction.lastExecutedAt || scheduleTransaction.startDate);
    
    switch (scheduleTransaction.frequency) {
      case 'daily':
        return new Date(lastExecution.getTime() + 24 * 60 * 60 * 1000);
      
      case 'weekly':
        return new Date(lastExecution.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      case 'monthly':
        const nextMonth = new Date(lastExecution);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        return nextMonth;
      
      case 'yearly':
        const nextYear = new Date(lastExecution);
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        return nextYear;
      
      default:
        return null;
    }
  }

  /**
   * Verifica si una transacción programada debe ejecutarse
   */
  static shouldExecute(scheduleTransaction) {
    if (!scheduleTransaction.isActive) return false;

    const now = new Date();
    const nextExecution = this.calculateNextExecution(scheduleTransaction);
    
    if (!nextExecution) return false;

    // Verificar si ha llegado la hora de ejecución
    if (now < nextExecution) return false;

    // Verificar si no ha excedido la fecha de fin
    if (scheduleTransaction.endDate) {
      const endDate = new Date(scheduleTransaction.endDate);
      if (now > endDate) return false;
    }

    // Verificar límite de ejecuciones
    if (scheduleTransaction.maxExecutions && 
        scheduleTransaction.executionCount >= scheduleTransaction.maxExecutions) {
      return false;
    }

    return true;
  }

  /**
   * Obtiene todas las transacciones programadas que deben ejecutarse
   */
  static getPendingExecutions(scheduleTransactions) {
    return scheduleTransactions.filter(schedule => this.shouldExecute(schedule));
  }

  /**
   * Calcula el impacto financiero de las transacciones programadas
   */
  static calculateScheduledImpact(scheduleTransactions, months = 3) {
    const impact = {
      totalIncome: 0,
      totalExpenses: 0,
      netImpact: 0,
      executionCount: 0
    };

    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + months);

    scheduleTransactions.forEach(schedule => {
      if (!schedule.isActive) return;

      const executions = this.calculateExecutionsInPeriod(schedule, new Date(), endDate);
      const amount = parseFloat(schedule.amount) || 0;

      impact.executionCount += executions;

      if (schedule.type === 'income') {
        impact.totalIncome += amount * executions;
        impact.netImpact += amount * executions;
      } else {
        impact.totalExpenses += amount * executions;
        impact.netImpact -= amount * executions;
      }
    });

    return impact;
  }

  /**
   * Calcula cuántas veces se ejecutará una transacción en un período
   */
  static calculateExecutionsInPeriod(scheduleTransaction, startDate, endDate) {
    if (!scheduleTransaction.isActive) return 0;

    const start = new Date(Math.max(startDate.getTime(), new Date(scheduleTransaction.startDate).getTime()));
    const end = new Date(Math.min(endDate.getTime(), 
      scheduleTransaction.endDate ? new Date(scheduleTransaction.endDate).getTime() : endDate.getTime()));

    if (start >= end) return 0;

    const diffTime = end.getTime() - start.getTime();
    let executions = 0;

    switch (scheduleTransaction.frequency) {
      case 'daily':
        executions = Math.floor(diffTime / (24 * 60 * 60 * 1000)) + 1;
        break;
      
      case 'weekly':
        executions = Math.floor(diffTime / (7 * 24 * 60 * 60 * 1000)) + 1;
        break;
      
      case 'monthly':
        const monthsDiff = (end.getFullYear() - start.getFullYear()) * 12 + 
                          (end.getMonth() - start.getMonth());
        executions = monthsDiff + 1;
        break;
      
      case 'yearly':
        executions = end.getFullYear() - start.getFullYear() + 1;
        break;
      
      default:
        executions = 0;
    }

    // Aplicar límite máximo de ejecuciones si existe
    if (scheduleTransaction.maxExecutions) {
      const remainingExecutions = scheduleTransaction.maxExecutions - 
                                 (scheduleTransaction.executionCount || 0);
      executions = Math.min(executions, remainingExecutions);
    }

    return Math.max(0, executions);
  }

  /**
   * Valida la configuración de una transacción programada
   */
  static validateScheduleConfiguration(scheduleData) {
    const errors = [];

    // Validar fechas
    const now = new Date();
    const startDate = new Date(scheduleData.startDate);
    
    if (startDate < now) {
      errors.push('La fecha de inicio no puede ser anterior a hoy');
    }

    if (scheduleData.endDate) {
      const endDate = new Date(scheduleData.endDate);
      if (endDate <= startDate) {
        errors.push('La fecha de fin debe ser posterior a la fecha de inicio');
      }
    }

    // Validar frecuencia
    const validFrequencies = ['daily', 'weekly', 'monthly', 'yearly'];
    if (!validFrequencies.includes(scheduleData.frequency)) {
      errors.push('La frecuencia especificada no es válida');
    }

    // Validar monto
    const amount = parseFloat(scheduleData.amount);
    if (isNaN(amount) || amount <= 0) {
      errors.push('El monto debe ser un número positivo');
    }

    // Validar límite de ejecuciones
    if (scheduleData.maxExecutions && 
        (!Number.isInteger(scheduleData.maxExecutions) || scheduleData.maxExecutions <= 0)) {
      errors.push('El límite de ejecuciones debe ser un número entero positivo');
    }

    return errors;
  }

  /**
   * Genera un resumen de transacciones programadas
   */
  static generateScheduleSummary(scheduleTransactions) {
    const summary = {
      total: scheduleTransactions.length,
      active: 0,
      inactive: 0,
      byFrequency: {
        daily: 0,
        weekly: 0,
        monthly: 0,
        yearly: 0
      },
      byType: {
        income: 0,
        expense: 0
      },
      totalMonthlyImpact: 0
    };

    scheduleTransactions.forEach(schedule => {
      if (schedule.isActive) {
        summary.active++;
        summary.byFrequency[schedule.frequency]++;
        summary.byType[schedule.type]++;

        // Calcular impacto mensual aproximado
        const amount = parseFloat(schedule.amount) || 0;
        let monthlyAmount = 0;

        switch (schedule.frequency) {
          case 'daily':
            monthlyAmount = amount * 30;
            break;
          case 'weekly':
            monthlyAmount = amount * 4.33;
            break;
          case 'monthly':
            monthlyAmount = amount;
            break;
          case 'yearly':
            monthlyAmount = amount / 12;
            break;
        }

        if (schedule.type === 'income') {
          summary.totalMonthlyImpact += monthlyAmount;
        } else {
          summary.totalMonthlyImpact -= monthlyAmount;
        }
      } else {
        summary.inactive++;
      }
    });

    return summary;
  }

  /**
   * Detecta conflictos o problemas en las transacciones programadas
   */
  static detectScheduleConflicts(scheduleTransactions) {
    const conflicts = [];
    
    scheduleTransactions.forEach((schedule, index) => {
      // Detectar transacciones duplicadas
      const duplicates = scheduleTransactions.filter((other, otherIndex) => 
        otherIndex !== index &&
        other.description === schedule.description &&
        other.amount === schedule.amount &&
        other.categoryId === schedule.categoryId &&
        other.frequency === schedule.frequency
      );

      if (duplicates.length > 0) {
        conflicts.push({
          type: 'duplicate',
          schedule: schedule,
          message: `Posible transacción duplicada: ${schedule.description}`
        });
      }

      // Detectar transacciones con fechas conflictivas
      if (schedule.endDate && new Date(schedule.endDate) < new Date()) {
        conflicts.push({
          type: 'expired',
          schedule: schedule,
          message: `Transacción programada expirada: ${schedule.description}`
        });
      }

      // Detectar transacciones inactivas con ejecuciones pendientes
      if (!schedule.isActive && this.shouldExecute({ ...schedule, isActive: true })) {
        conflicts.push({
          type: 'inactive_pending',
          schedule: schedule,
          message: `Transacción inactiva con ejecuciones pendientes: ${schedule.description}`
        });
      }
    });

    return conflicts;
  }
}
