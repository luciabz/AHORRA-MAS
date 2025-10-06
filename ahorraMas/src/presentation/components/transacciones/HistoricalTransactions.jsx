import { useState } from 'react';
import { useTransactions } from '../../hooks/useTransactions';
import { useScheduledTransactions } from '../../hooks/useScheduledTransactions';
import { useCategories } from '../../hooks/useCategories';

export default function HistoricalTransactions() {
  const { transactions, loading: transLoading, error: transError, editTransaction, removeTransaction, addTransaction } = useTransactions();
  const { scheduledTransactions, loading: scheduleLoading, error: scheduleError, addScheduledTransaction } = useScheduledTransactions();
  const { categories } = useCategories();
  
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  
  const loading = transLoading || scheduleLoading;
  const error = transError || scheduleError;
  
  // Combinar transacciones regulares y programadas
  const allTransactions = [
    ...transactions.map(t => ({ ...t, isScheduled: false })),
    ...scheduledTransactions.map(t => ({ ...t, isScheduled: true }))
  ].sort((a, b) => new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt));

  const handleEdit = async (transaction) => {
    // Crear modal o formulario de edición
    const updatedData = {
      description: prompt('Nueva descripción:', transaction.description),
      amount: parseFloat(prompt('Nuevo monto:', transaction.amount)),
      type: confirm('¿Es un ingreso?') ? 'income' : 'expense'
    };

    if (updatedData.description && updatedData.amount) {
      await editTransaction(transaction.id, updatedData);
    }
  };

  const handleDelete = async (transactionId) => {
    if (confirm('¿Estás seguro de eliminar esta transacción?')) {
      await removeTransaction(transactionId);
    }
  };

  const handleCreateTransaction = async (formData) => {
    try {
      const result = await addTransaction(formData);
      if (result.success) {
        setShowTransactionModal(false);
      } else {
        alert(result.message || 'Error al crear la transacción');
      }
    } catch (error) {
      console.error('Error creando transacción:', error);
      alert('Error al crear la transacción');
    }
  };

  const handleCreateScheduleTransaction = async (formData) => {
    try {
      const result = await addScheduledTransaction(formData);
      if (result.success) {
        setShowScheduleModal(false);
      } else {
        alert(result.message || 'Error al crear la transacción programada');
      }
    } catch (error) {
      console.error('Error creando transacción programada:', error);
      alert('Error al crear la transacción programada');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8 text-gray-500">Cargando transacciones...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8 text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Transacciones</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowTransactionModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nueva Transacción
          </button>
          <button
            onClick={() => setShowScheduleModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Transacción Programada
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Tipo</th>
              <th className="px-4 py-2 text-left">Descripción</th>
              <th className="px-4 py-2 text-left">Monto</th>
              <th className="px-4 py-2 text-left">Regularidad</th>
              <th className="px-4 py-2 text-left">Fecha</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {allTransactions.map(transaction => (
              <tr key={`${transaction.isScheduled ? 'sched' : 'trans'}-${transaction.id}`} className="border-b">
                <td className="px-4 py-2">
                  <div className="flex flex-col gap-1">
                    <span className={`px-2 py-1 rounded text-sm ${transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {transaction.type === 'income' ? 'Ingreso' : 'Egreso'}
                    </span>
                    {transaction.isScheduled && (
                      <span className="px-2 py-1 rounded text-xs bg-purple-100 text-purple-800">
                        Programada
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2">{transaction.description}</td>
                <td className="px-4 py-2">${parseFloat(transaction.amount).toLocaleString()}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-sm ${transaction.regularity === 'static' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {transaction.regularity === 'static' ? 'Fijo' : 'Variable'}
                  </span>
                  {transaction.isScheduled && transaction.status && (
                    <span className="ml-2 px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                      Activa
                    </span>
                  )}
                </td>
                <td className="px-4 py-2">
                  <div className="text-sm">
                    <div>{new Date(transaction.createdAt).toLocaleDateString()}</div>
                    {transaction.isScheduled && transaction.nextOccurrence && (
                      <div className="text-gray-500 text-xs">
                        Próxima: {new Date(transaction.nextOccurrence).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleEdit(transaction)}
                    className="text-blue-600 hover:text-blue-800 mr-3 inline-flex items-center"
                    title="Editar transacción"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    className="text-red-600 hover:text-red-800 inline-flex items-center"
                    title="Eliminar transacción"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {allTransactions.length === 0 && (
          <div className="text-center py-8 text-gray-500">No hay transacciones históricas</div>
        )}
      </div>

      {/* Modal para Nueva Transacción */}
      {showTransactionModal && (
        <TransactionModal
          isOpen={showTransactionModal}
          onClose={() => setShowTransactionModal(false)}
          onSubmit={handleCreateTransaction}
          categories={categories}
          title="Nueva Transacción"
        />
      )}

      {/* Modal para Transacción Programada */}
      {showScheduleModal && (
        <ScheduleTransactionModal
          isOpen={showScheduleModal}
          onClose={() => setShowScheduleModal(false)}
          onSubmit={handleCreateScheduleTransaction}
          categories={categories}
          title="Nueva Transacción Programada"
        />
      )}
    </div>
  );
}

// Componente Modal para Transacciones Regulares
function TransactionModal({ isOpen, onClose, onSubmit, categories, title }) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    regularity: 'variable',
    categoryId: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.categoryId) {
      alert('Por favor completa todos los campos');
      return;
    }
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount)
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Ej: Compra supermercado"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monto</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="expense">Egreso</option>
              <option value="income">Ingreso</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Regularidad</label>
            <select
              name="regularity"
              value={formData.regularity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="variable">Variable</option>
              <option value="static">Fijo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Selecciona una categoría</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Crear Transacción
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Componente Modal para Transacciones Programadas
function ScheduleTransactionModal({ isOpen, onClose, onSubmit, categories, title }) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    regularity: 'variable',
    categoryId: '',
    periodicity: '30 day',
    nextOccurrence: '',
    endDate: '',
    status: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.categoryId || !formData.nextOccurrence) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
      nextOccurrence: new Date(formData.nextOccurrence).toISOString(),
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Ej: Alquiler mensual"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monto</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="0.00"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="expense">Egreso</option>
                <option value="income">Ingreso</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Regularidad</label>
              <select
                name="regularity"
                value={formData.regularity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="variable">Variable</option>
                <option value="static">Fijo</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Selecciona una categoría</option>
              {categories.map(category => (
                <option className="text-gray-900" key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Frecuencia</label>
            <select
              name="periodicity"
              value={formData.periodicity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="7 day">Semanal (7 días)</option>
              <option value="15 day">Quincenal (15 días)</option>
              <option value="30 day">Mensual (30 días)</option>
              <option value="90 day">Trimestral (90 días)</option>
              <option value="365 day">Anual (365 días)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Próxima Ejecución</label>
            <input
              type="datetime-local"
              name="nextOccurrence"
              value={formData.nextOccurrence}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Fin (Opcional)</label>
            <input
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="status"
              checked={formData.status}
              onChange={handleChange}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Activar inmediatamente
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Crear Programada
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
