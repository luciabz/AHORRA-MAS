import { Goal } from '../models/Goal.js';

/**
 * GoalService - Servicio de dominio para gestión de metas financieras
 * Contiene la lógica de negocio para el seguimiento y análisis de metas
 */
export class GoalService {

  /**
   * Calcula el progreso actual de una meta
   */
  static calculateProgress(goal, transactions = []) {
    const targetAmount = parseFloat(goal.targetAmount) || 0;
    
    if (targetAmount <= 0) {
      return {
        percentage: 0,
        currentAmount: 0,
        remainingAmount: targetAmount,
        isCompleted: false
      };
    }

    // Filtrar transacciones relacionadas con la meta
    const relatedTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.createdAt);
      const goalStartDate = new Date(goal.startDate);
      const goalEndDate = goal.endDate ? new Date(goal.endDate) : new Date();

      return transactionDate >= goalStartDate && 
             transactionDate <= goalEndDate &&
             (goal.categoryId ? transaction.categoryId === goal.categoryId : true);
    });

    let currentAmount = 0;

    switch (goal.type) {
      case 'saving':
        // Para metas de ahorro, sumamos ingresos menos gastos
        currentAmount = relatedTransactions.reduce((total, t) => {
          const amount = parseFloat(t.amount) || 0;
          return t.type === 'income' ? total + amount : total - amount;
        }, 0);
        break;

      case 'expense_limit':
        // Para límites de gasto, sumamos solo los gastos
        currentAmount = relatedTransactions
          .filter(t => t.type === 'expense')
          .reduce((total, t) => total + (parseFloat(t.amount) || 0), 0);
        break;

      case 'income_target':
        // Para metas de ingresos, sumamos solo los ingresos
        currentAmount = relatedTransactions
          .filter(t => t.type === 'income')
          .reduce((total, t) => total + (parseFloat(t.amount) || 0), 0);
        break;

      default:
        currentAmount = 0;
    }

    const percentage = (currentAmount / targetAmount) * 100;
    const remainingAmount = targetAmount - currentAmount;
    const isCompleted = goal.type === 'expense_limit' 
      ? currentAmount <= targetAmount 
      : currentAmount >= targetAmount;

    return {
      percentage: Math.max(0, Math.min(100, percentage)),
      currentAmount: Math.max(0, currentAmount),
      remainingAmount: Math.max(0, remainingAmount),
      isCompleted
    };
  }

  /**
   * Calcula cuánto tiempo queda para alcanzar una meta
   */
  static calculateTimeToGoal(goal, transactions = []) {
    const progress = this.calculateProgress(goal, transactions);
    
    if (progress.isCompleted) {
      return {
        daysRemaining: 0,
        estimatedDate: new Date(),
        isReachable: true
      };
    }

    const endDate = goal.endDate ? new Date(goal.endDate) : null;
    const now = new Date();
    const daysElapsed = Math.max(1, Math.floor((now - new Date(goal.startDate)) / (1000 * 60 * 60 * 24)));
    
    // Calcular velocidad promedio de progreso
    const dailyProgress = progress.currentAmount / daysElapsed;
    
    if (dailyProgress <= 0) {
      return {
        daysRemaining: Infinity,
        estimatedDate: null,
        isReachable: false
      };
    }

    const daysToComplete = Math.ceil(progress.remainingAmount / dailyProgress);
    const estimatedDate = new Date(now.getTime() + daysToComplete * 24 * 60 * 60 * 1000);
    
    const isReachable = !endDate || estimatedDate <= endDate;

    return {
      daysRemaining: daysToComplete,
      estimatedDate,
      isReachable
    };
  }

  /**
   * Genera recomendaciones para alcanzar una meta
   */
  static generateRecommendations(goal, transactions = []) {
    const progress = this.calculateProgress(goal, transactions);
    const timeAnalysis = this.calculateTimeToGoal(goal, transactions);
    const recommendations = [];

    // Si la meta está completada
    if (progress.isCompleted) {
      recommendations.push({
        type: 'success',
        title: '¡Meta alcanzada!',
        message: `Felicidades, has completado tu meta: ${goal.title}`,
        priority: 'high'
      });
      return recommendations;
    }

    // Si no es alcanzable en el tiempo disponible
    if (!timeAnalysis.isReachable && goal.endDate) {
      const daysRemaining = Math.floor((new Date(goal.endDate) - new Date()) / (1000 * 60 * 60 * 24));
      const dailyAmountNeeded = progress.remainingAmount / Math.max(1, daysRemaining);
      
      recommendations.push({
        type: 'warning',
        title: 'Meta en riesgo',
        message: `Necesitas ${dailyAmountNeeded.toFixed(2)} por día para alcanzar tu meta a tiempo`,
        priority: 'high'
      });
    }

    // Recomendaciones específicas por tipo de meta
    switch (goal.type) {
      case 'saving':
        if (progress.percentage < 25) {
          recommendations.push({
            type: 'info',
            title: 'Aumenta tus ahorros',
            message: 'Considera reducir gastos no esenciales o buscar ingresos adicionales',
            priority: 'medium'
          });
        }
        break;

      case 'expense_limit':
        if (progress.percentage > 75) {
          recommendations.push({
            type: 'warning',
            title: 'Cerca del límite de gasto',
            message: `Has gastado el ${progress.percentage.toFixed(1)}% de tu límite`,
            priority: 'high'
          });
        }
        break;

      case 'income_target':
        if (progress.percentage < 50 && goal.endDate) {
          recommendations.push({
            type: 'info',
            title: 'Busca oportunidades adicionales',
            message: 'Considera fuentes de ingresos adicionales para alcanzar tu meta',
            priority: 'medium'
          });
        }
        break;
    }

    return recommendations;
  }

  /**
   * Calcula estadísticas de todas las metas de un usuario
   */
  static calculateGoalStatistics(goals, transactions = []) {
    const stats = {
      total: goals.length,
      completed: 0,
      inProgress: 0,
      overdue: 0,
      averageProgress: 0,
      totalTargetAmount: 0,
      totalCurrentAmount: 0
    };

    if (goals.length === 0) return stats;

    let totalProgress = 0;
    const now = new Date();

    goals.forEach(goal => {
      const progress = this.calculateProgress(goal, transactions);
      const targetAmount = parseFloat(goal.targetAmount) || 0;
      
      stats.totalTargetAmount += targetAmount;
      stats.totalCurrentAmount += progress.currentAmount;
      totalProgress += progress.percentage;

      if (progress.isCompleted) {
        stats.completed++;
      } else {
        stats.inProgress++;
        
        // Verificar si está vencida
        if (goal.endDate && new Date(goal.endDate) < now) {
          stats.overdue++;
        }
      }
    });

    stats.averageProgress = totalProgress / goals.length;
    
    return stats;
  }

  /**
   * Encuentra metas relacionadas o conflictivas
   */
  static findRelatedGoals(goals, newGoal) {
    return goals.filter(existingGoal => {
      // Misma categoría
      if (newGoal.categoryId && existingGoal.categoryId === newGoal.categoryId) {
        return true;
      }

      // Mismo tipo y fechas superpuestas
      if (existingGoal.type === newGoal.type) {
        const existingStart = new Date(existingGoal.startDate);
        const existingEnd = existingGoal.endDate ? new Date(existingGoal.endDate) : new Date('2099-12-31');
        const newStart = new Date(newGoal.startDate);
        const newEnd = newGoal.endDate ? new Date(newGoal.endDate) : new Date('2099-12-31');

        // Verificar superposición de fechas
        return !(existingEnd < newStart || newEnd < existingStart);
      }

      return false;
    });
  }

  /**
   * Valida si una meta es realista basándose en el historial
   */
  static validateGoalRealism(goal, historicalTransactions = []) {
    if (historicalTransactions.length < 30) {
      return {
        isRealistic: null,
        confidence: 'low',
        message: 'Datos insuficientes para validar la meta'
      };
    }

    // Calcular promedios históricos del último período
    const monthsOfHistory = 3;
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - monthsOfHistory);
    
    const recentTransactions = historicalTransactions.filter(t => 
      new Date(t.createdAt) >= cutoffDate
    );

    let historicalAverage = 0;
    
    switch (goal.type) {
      case 'saving':
        historicalAverage = recentTransactions.reduce((total, t) => {
          const amount = parseFloat(t.amount) || 0;
          return t.type === 'income' ? total + amount : total - amount;
        }, 0) / monthsOfHistory;
        break;

      case 'expense_limit':
        historicalAverage = recentTransactions
          .filter(t => t.type === 'expense' && (!goal.categoryId || t.categoryId === goal.categoryId))
          .reduce((total, t) => total + (parseFloat(t.amount) || 0), 0) / monthsOfHistory;
        break;

      case 'income_target':
        historicalAverage = recentTransactions
          .filter(t => t.type === 'income')
          .reduce((total, t) => total + (parseFloat(t.amount) || 0), 0) / monthsOfHistory;
        break;
    }

    const goalDuration = goal.endDate 
      ? Math.max(1, Math.floor((new Date(goal.endDate) - new Date(goal.startDate)) / (1000 * 60 * 60 * 24 * 30)))
      : 12; // Asumir 12 meses si no hay fecha fin

    const requiredMonthlyAmount = (parseFloat(goal.targetAmount) || 0) / goalDuration;
    const difficultyRatio = requiredMonthlyAmount / Math.max(1, Math.abs(historicalAverage));

    let isRealistic, confidence, message;

    if (difficultyRatio <= 1.2) {
      isRealistic = true;
      confidence = 'high';
      message = 'Meta realista basada en tu historial';
    } else if (difficultyRatio <= 2) {
      isRealistic = true;
      confidence = 'medium';
      message = 'Meta ambiciosa pero alcanzable con esfuerzo';
    } else {
      isRealistic = false;
      confidence = 'high';
      message = 'Meta muy ambiciosa, considera ajustar el monto o plazo';
    }

    return {
      isRealistic,
      confidence,
      message,
      difficultyRatio,
      historicalAverage,
      requiredMonthlyAmount
    };
  }

  /**
   * Genera un plan de acción para alcanzar una meta
   */
  static generateActionPlan(goal, transactions = []) {
    const progress = this.calculateProgress(goal, transactions);
    const timeAnalysis = this.calculateTimeToGoal(goal, transactions);
    
    if (progress.isCompleted) {
      return {
        status: 'completed',
        actions: ['¡Meta completada! Considera establecer una nueva meta.']
      };
    }

    const actions = [];
    const daysRemaining = goal.endDate 
      ? Math.floor((new Date(goal.endDate) - new Date()) / (1000 * 60 * 60 * 24))
      : timeAnalysis.daysRemaining;

    const dailyTarget = progress.remainingAmount / Math.max(1, daysRemaining);

    switch (goal.type) {
      case 'saving':
        actions.push(`Ahorra ${dailyTarget.toFixed(2)} diarios para alcanzar tu meta`);
        actions.push('Revisa y reduce gastos no esenciales');
        actions.push('Considera automatizar transferencias a ahorro');
        break;

      case 'expense_limit':
        const dailyLimit = progress.remainingAmount / Math.max(1, daysRemaining);
        actions.push(`Limita tus gastos a ${dailyLimit.toFixed(2)} diarios`);
        actions.push('Prioriza gastos esenciales');
        actions.push('Evita compras impulsivas');
        break;

      case 'income_target':
        actions.push(`Genera ${dailyTarget.toFixed(2)} adicionales diarios`);
        actions.push('Busca oportunidades de ingresos extra');
        actions.push('Optimiza tus fuentes de ingreso actuales');
        break;
    }

    return {
      status: timeAnalysis.isReachable ? 'on_track' : 'at_risk',
      actions,
      dailyTarget: dailyTarget.toFixed(2),
      daysRemaining
    };
  }
}
