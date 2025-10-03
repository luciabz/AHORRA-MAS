import { Transaction } from '../models/Transaction.js';

/**
 * FinancialAnalysisService - Servicio de dominio para análisis financiero
 * Contiene la lógica de negocio compleja para análisis de transacciones
 */
export class FinancialAnalysisService {
  
  /**
   * Calcula el balance financiero de un usuario
   */
  static calculateBalance(transactions) {
    return transactions.reduce((balance, transaction) => {
      const amount = parseFloat(transaction.amount) || 0;
      return transaction.type === 'income' 
        ? balance + amount 
        : balance - amount;
    }, 0);
  }

  /**
   * Calcula promedios de ingresos y gastos
   */
  static calculateAverages(transactions, periodInDays = 30) {
    if (transactions.length === 0) {
      return { avgIncome: 0, avgExpense: 0, avgBalance: 0 };
    }

    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((total, t) => total + (parseFloat(t.amount) || 0), 0);

    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((total, t) => total + (parseFloat(t.amount) || 0), 0);

    const avgIncome = income / periodInDays;
    const avgExpense = expense / periodInDays;
    const avgBalance = avgIncome - avgExpense;

    return { avgIncome, avgExpense, avgBalance };
  }

  /**
   * Analiza patrones de gastos por categoría
   */
  static analyzeSpendingPatterns(transactions, categories) {
    const categoryMap = new Map(categories.map(c => [c.id, c]));
    const patterns = {};

    transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        const category = categoryMap.get(transaction.categoryId);
        const categoryName = category?.name || 'Sin categoría';
        
        if (!patterns[categoryName]) {
          patterns[categoryName] = {
            total: 0,
            count: 0,
            average: 0,
            percentage: 0
          };
        }
        
        patterns[categoryName].total += parseFloat(transaction.amount) || 0;
        patterns[categoryName].count++;
      });

    // Calcular totales y porcentajes
    const totalExpenses = Object.values(patterns)
      .reduce((sum, p) => sum + p.total, 0);

    Object.values(patterns).forEach(pattern => {
      pattern.average = pattern.count > 0 ? pattern.total / pattern.count : 0;
      pattern.percentage = totalExpenses > 0 ? (pattern.total / totalExpenses) * 100 : 0;
    });

    return patterns;
  }

  /**
   * Detecta transacciones inusuales (outliers)
   */
  static detectUnusualTransactions(transactions, standardDeviations = 2) {
    if (transactions.length < 3) return [];

    const amounts = transactions.map(t => parseFloat(t.amount) || 0);
    const mean = amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;
    
    const variance = amounts.reduce((sum, amount) => {
      return sum + Math.pow(amount - mean, 2);
    }, 0) / amounts.length;
    
    const stdDev = Math.sqrt(variance);
    const threshold = mean + (stdDev * standardDeviations);

    return transactions.filter(t => {
      const amount = parseFloat(t.amount) || 0;
      return amount > threshold;
    });
  }

  /**
   * Calcula proyecciones financieras
   */
  static calculateProjections(transactions, months = 3) {
    const monthlyData = this.calculateAverages(transactions, 30);
    
    return {
      projectedIncome: monthlyData.avgIncome * 30 * months,
      projectedExpenses: monthlyData.avgExpense * 30 * months,
      projectedBalance: monthlyData.avgBalance * 30 * months,
      months
    };
  }

  /**
   * Analiza tendencias temporales
   */
  static analyzeTrends(transactions, periodInMonths = 6) {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - periodInMonths, 1);
    
    const monthlyTotals = {};
    
    transactions
      .filter(t => new Date(t.createdAt) >= startDate)
      .forEach(transaction => {
        const date = new Date(transaction.createdAt);
        const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        
        if (!monthlyTotals[monthKey]) {
          monthlyTotals[monthKey] = { income: 0, expense: 0, balance: 0 };
        }
        
        const amount = parseFloat(transaction.amount) || 0;
        if (transaction.type === 'income') {
          monthlyTotals[monthKey].income += amount;
          monthlyTotals[monthKey].balance += amount;
        } else {
          monthlyTotals[monthKey].expense += amount;
          monthlyTotals[monthKey].balance -= amount;
        }
      });

    return monthlyTotals;
  }

  /**
   * Calcula métricas de salud financiera
   */
  static calculateHealthMetrics(transactions) {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((total, t) => total + (parseFloat(t.amount) || 0), 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((total, t) => total + (parseFloat(t.amount) || 0), 0);

    const savingsRate = totalIncome > 0 
      ? ((totalIncome - totalExpenses) / totalIncome) * 100 
      : 0;

    const expenseRatio = totalIncome > 0 
      ? (totalExpenses / totalIncome) * 100 
      : 0;

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      savingsRate: Math.max(0, savingsRate),
      expenseRatio: Math.min(100, expenseRatio),
      isHealthy: savingsRate > 20 && expenseRatio < 80
    };
  }

  /**
   * Genera recomendaciones basadas en patrones de gasto
   */
  static generateRecommendations(transactions, categories) {
    const patterns = this.analyzeSpendingPatterns(transactions, categories);
    const healthMetrics = this.calculateHealthMetrics(transactions);
    const recommendations = [];

    // Recomendación por tasa de ahorro baja
    if (healthMetrics.savingsRate < 10) {
      recommendations.push({
        type: 'warning',
        title: 'Tasa de ahorro baja',
        message: 'Tu tasa de ahorro es menor al 10%. Considera reducir gastos no esenciales.',
        priority: 'high'
      });
    }

    // Recomendaciones por categorías de gasto alto
    Object.entries(patterns).forEach(([category, data]) => {
      if (data.percentage > 40) {
        recommendations.push({
          type: 'info',
          title: `Gasto alto en ${category}`,
          message: `${category} representa el ${data.percentage.toFixed(1)}% de tus gastos.`,
          priority: 'medium'
        });
      }
    });

    // Recomendación por balance negativo
    if (healthMetrics.balance < 0) {
      recommendations.push({
        type: 'error',
        title: 'Balance negativo',
        message: 'Tus gastos superan tus ingresos. Revisa tu presupuesto urgentemente.',
        priority: 'high'
      });
    }

    return recommendations;
  }
}
