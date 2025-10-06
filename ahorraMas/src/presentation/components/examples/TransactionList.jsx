import React, { useEffect, useState } from 'react';
import { useTransactions, useCategories } from '../../hooks/useCleanArchitecture';
import { useCleanArchitectureContext } from '../../context/CleanArchitectureContext';

/**
 * TransactionList - Ejemplo de componente usando Clean Architecture
 * Muestra cómo integrar completamente los casos de uso con React
 */
const TransactionList = () => {
  const { currentUser } = useCleanArchitectureContext();
  const {
    transactions,
    loading: transactionLoading,
    error: transactionError,
    loadTransactions,
    createTransaction,
    deleteTransaction,
    loadStatistics,
    clearError: clearTransactionError
  } = useTransactions();

  const {
    categories,
    loading: categoryLoading,
    loadCategories
  } = useCategories();

  const [showForm, setShowForm] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    type: 'expense',
    categoryId: '',
    date: new Date().toISOString().split('T')[0]
  });

  const loading = transactionLoading || categoryLoading;
  const error = transactionError;

  useEffect(() => {
    if (currentUser?.id) {
      loadInitialData();
    }
  }, [currentUser]);

  const loadInitialData = async () => {
    try {
      await Promise.all([
        loadTransactions(currentUser.id),
        loadCategories(currentUser.id)
      ]);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTransaction({
        ...newTransaction,
        userId: currentUser.id,
        amount: parseFloat(newTransaction.amount)
      });
      
      // Resetear formulario
      setNewTransaction({
        description: '',
        amount: '',
        type: 'expense',
        categoryId: '',
        date: new Date().toISOString().split('T')[0]
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  const handleDelete = async (transactionId) => {
    if (window.confirm('¿Estás seguro de eliminar esta transacción?')) {
      try {
        await deleteTransaction(transactionId, currentUser.id);
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Transacciones</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          {showForm ? 'Cancelar' : 'Nueva Transacción'}
        </button>
      </div>

      {/* Mostrar errores */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={clearTransactionError}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Formulario */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">Nueva Transacción</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <input
                type="text"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({
                  ...newTransaction,
                  description: e.target.value
                })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monto
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({
                    ...newTransaction,
                    amount: e.target.value
                  })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <select
                  value={newTransaction.type}
                  onChange={(e) => setNewTransaction({
                    ...newTransaction,
                    type: e.target.value
                  })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="income">Ingreso</option>
                  <option value="expense">Gasto</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <select
                  value={newTransaction.categoryId}
                  onChange={(e) => setNewTransaction({
                    ...newTransaction,
                    categoryId: e.target.value
                  })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  {categories
                    .filter(cat => cat.type === newTransaction.type)
                    .map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction({
                    ...newTransaction,
                    date: e.target.value
                  })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de transacciones */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Historial de Transacciones</h3>
        </div>
        
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No hay transacciones registradas
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {transactions.map((transaction) => {
              const category = categories.find(cat => cat.id === transaction.categoryId);
              return (
                <div key={transaction.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-900">
                        {transaction.description}
                      </div>
                      <div className="text-sm text-gray-500">
                        {category?.name} • {new Date(transaction.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`font-semibold ${
                        transaction.type === 'income' 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}
                        ${transaction.amount.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
