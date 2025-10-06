import React from 'react';
import { useUsers, useTransactions, useCategories, useScheduleTransactions, useGoals, useFinancialAnalysis } from '../hooks/useCleanArchitecture';

/**
 * Componente de prueba para verificar que todos los hooks funcionan correctamente
 */
export default function TestComponent() {
  const { user, loading: userLoading, error: userError } = useUsers();
  const { transactions, loading: transLoading, error: transError } = useTransactions();
  const { categories, loading: catLoading, error: catError } = useCategories();
  const { scheduleTransactions, loading: scheduleLoading, error: scheduleError } = useScheduleTransactions();
  const { goals, loading: goalLoading, error: goalError } = useGoals();
  const { calculateTotals, calculateMonthlyStats, getTransactionsWithCategories } = useFinancialAnalysis();

  const loading = userLoading || transLoading || catLoading || scheduleLoading || goalLoading;
  const error = userError || transError || catError || scheduleError || goalError;

  if (loading) {
    return (
      <div className="p-4 bg-blue-100 border border-blue-300 rounded">
        <h2 className="text-blue-800 font-semibold">🔄 Cargando Clean Architecture...</h2>
        <p className="text-blue-600">Inicializando hooks y casos de uso</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-300 rounded">
        <h2 className="text-red-800 font-semibold">❌ Error en Clean Architecture</h2>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const totals = calculateTotals();
  const monthlyStats = calculateMonthlyStats();

  return (
    <div className="p-4 bg-green-100 border border-green-300 rounded">
      <h2 className="text-green-800 font-semibold">✅ Clean Architecture funcionando correctamente!</h2>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-3 rounded shadow">
          <h3 className="font-semibold">Usuario</h3>
          <p>Estado: {user ? `Logueado como ${user.name || 'Usuario'}` : 'No logueado'}</p>
        </div>
        
        <div className="bg-white p-3 rounded shadow">
          <h3 className="font-semibold">Transacciones</h3>
          <p>Total: {transactions.length}</p>
        </div>
        
        <div className="bg-white p-3 rounded shadow">
          <h3 className="font-semibold">Categorías</h3>
          <p>Total: {categories.length}</p>
        </div>
        
        <div className="bg-white p-3 rounded shadow">
          <h3 className="font-semibold">Programadas</h3>
          <p>Total: {scheduleTransactions.length}</p>
        </div>
        
        <div className="bg-white p-3 rounded shadow">
          <h3 className="font-semibold">Metas</h3>
          <p>Total: {goals.length}</p>
        </div>
        
        <div className="bg-white p-3 rounded shadow">
          <h3 className="font-semibold">Análisis</h3>
          <p>Ingresos: ${totals.ingresoTotal?.toFixed(2) || '0.00'}</p>
          <p>Gastos: ${(totals.gastoFijoTotal + totals.gastoVariableTotal)?.toFixed(2) || '0.00'}</p>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-green-600">
        <p>• Todos los hooks de Clean Architecture están funcionando</p>
        <p>• Los casos de uso se están ejecutando correctamente</p>
        <p>• La inyección de dependencias funciona</p>
        <p>• El análisis financiero está operativo</p>
      </div>
    </div>
  );
}
