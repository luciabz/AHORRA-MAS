export default function TransactionModal({ 
  showForm,
  formType,
  editingItem,
  transactionForm,
  setTransactionForm,
  scheduleForm,
  setScheduleForm,
  categories,
  onTransactionSubmit,
  onScheduleSubmit,
  onCancel
}) {
  if (!showForm || formType === 'category') return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">
          {editingItem ? 'Editar' : 'Crear'} {
            formType === 'transaction' ? 'Transacción' : 'Transacción Programada'
          }
        </h3>

        {formType === 'transaction' && (
          <form onSubmit={onTransactionSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select
                value={transactionForm.type}
                onChange={(e) => setTransactionForm({...transactionForm, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="income">Ingreso</option>
                <option value="expense">Egreso</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Regularidad</label>
              <select
                value={transactionForm.regularity}
                onChange={(e) => setTransactionForm({...transactionForm, regularity: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="static">Fijo</option>
                <option value="variable">Variable</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <input
                type="text"
                value={transactionForm.description}
                onChange={(e) => setTransactionForm({...transactionForm, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monto</label>
              <input
                type="number"
                step="0.01"
                value={transactionForm.amount}
                onChange={(e) => setTransactionForm({...transactionForm, amount: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select
                value={transactionForm.categoryId}
                onChange={(e) => setTransactionForm({...transactionForm, categoryId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Seleccionar categoría</option>
                {categories.filter(c => c.type === transactionForm.type).map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 transition"
              >
                {editingItem ? 'Actualizar' : 'Crear'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-400 text-white py-2 rounded-md hover:bg-gray-500 transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {formType === 'schedule' && (
          <form onSubmit={onScheduleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select
                value={scheduleForm.type}
                onChange={(e) => setScheduleForm({...scheduleForm, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="income">Ingreso</option>
                <option value="expense">Egreso</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Regularidad</label>
              <select
                value={scheduleForm.regularity}
                onChange={(e) => setScheduleForm({...scheduleForm, regularity: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="static">Fijo</option>
                <option value="variable">Variable</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <input
                type="text"
                value={scheduleForm.description}
                onChange={(e) => setScheduleForm({...scheduleForm, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monto</label>
              <input
                type="number"
                step="0.01"
                value={scheduleForm.amount}
                onChange={(e) => setScheduleForm({...scheduleForm, amount: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select
                value={scheduleForm.categoryId}
                onChange={(e) => setScheduleForm({...scheduleForm, categoryId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Seleccionar categoría</option>
                {categories.filter(c => c.type === scheduleForm.type).map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Periodicidad</label>
              <select
                value={scheduleForm.periodicity}
                onChange={(e) => setScheduleForm({...scheduleForm, periodicity: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="7 day">Semanal</option>
                <option value="15 day">Quincenal</option>
                <option value="30 day">Mensual</option>
                <option value="90 day">Trimestral</option>
                <option value="365 day">Anual</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Próxima ocurrencia</label>
              <input
                type="date"
                value={scheduleForm.nextOccurrence}
                onChange={(e) => setScheduleForm({...scheduleForm, nextOccurrence: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de fin (opcional)</label>
              <input
                type="date"
                value={scheduleForm.endDate}
                onChange={(e) => setScheduleForm({...scheduleForm, endDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 transition"
              >
                {editingItem ? 'Actualizar' : 'Crear'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-400 text-white py-2 rounded-md hover:bg-gray-500 transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
