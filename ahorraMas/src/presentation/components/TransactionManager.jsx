import React, { useState, useEffect } from 'react';
import { TransactionApi } from '../../infrastructure/api/transactionApi';
import { ScheduleTransactionApi } from '../../infrastructure/api/scheduleTransactionApi';
import { CategoryApi } from '../../infrastructure/api/categoryApi';
import Swal from 'sweetalert2';

export default function TransactionManager() {
  const [transactions, setTransactions] = useState([]);
  const [scheduleTransactions, setScheduleTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('historicas'); // 'historicas', 'programadas', 'categorias'
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formType, setFormType] = useState('transaction'); // 'transaction', 'schedule', 'category'

  const token = localStorage.getItem('token');

  // Estados del formulario
  const [transactionForm, setTransactionForm] = useState({
    type: 'income',
    regularity: 'static',
    description: '',
    amount: '',
    categoryId: ''
  });

  const [scheduleForm, setScheduleForm] = useState({
    type: 'income',
    regularity: 'static',
    description: '',
    amount: '',
    categoryId: '',
    periodicity: '30 day',
    nextOccurrence: '',
    endDate: ''
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    type: 'income'
  });

  // Cargar datos
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [transactionData, scheduleData, categoryData] = await Promise.all([
        TransactionApi.list(token),
        ScheduleTransactionApi.list(token),
        CategoryApi.list(token)
      ]);
      setTransactions(transactionData);
      setScheduleTransactions(scheduleData);
      setCategories(categoryData);
    } catch (error) {
      console.error('Error loading data:', error);
      Swal.fire('Error', 'No se pudieron cargar los datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Funciones para transacciones históricas
  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const updated = await TransactionApi.update(editingItem.id, transactionForm, token);
        setTransactions(transactions.map(t => t.id === editingItem.id ? updated : t));
        Swal.fire('Actualizada', 'Transacción actualizada exitosamente', 'success');
      } else {
        const newTransaction = await TransactionApi.create(transactionForm, token);
        setTransactions([...transactions, newTransaction]);
        Swal.fire('Creada', 'Transacción creada exitosamente', 'success');
      }
      resetForm();
    } catch (error) {
      Swal.fire('Error', 'No se pudo guardar la transacción', 'error');
    }
  };

  const deleteTransaction = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar transacción?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    
    if (result.isConfirmed) {
      try {
        await TransactionApi.remove(id, token);
        setTransactions(transactions.filter(t => t.id !== id));
        Swal.fire('Eliminada', 'Transacción eliminada exitosamente', 'success');
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar la transacción', 'error');
      }
    }
  };

  // Funciones para transacciones programadas
  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const updated = await ScheduleTransactionApi.update(editingItem.id, scheduleForm, token);
        setScheduleTransactions(scheduleTransactions.map(s => s.id === editingItem.id ? updated : s));
        Swal.fire('Actualizada', 'Transacción programada actualizada exitosamente', 'success');
      } else {
        const newSchedule = await ScheduleTransactionApi.create(scheduleForm, token);
        setScheduleTransactions([...scheduleTransactions, newSchedule]);
        Swal.fire('Creada', 'Transacción programada creada exitosamente', 'success');
      }
      resetForm();
    } catch (error) {
      Swal.fire('Error', 'No se pudo guardar la transacción programada', 'error');
    }
  };

  const deleteScheduleTransaction = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar transacción programada?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    
    if (result.isConfirmed) {
      try {
        await ScheduleTransactionApi.remove(id, token);
        setScheduleTransactions(scheduleTransactions.filter(s => s.id !== id));
        Swal.fire('Eliminada', 'Transacción programada eliminada exitosamente', 'success');
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar la transacción programada', 'error');
      }
    }
  };

  // Funciones para categorías
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const updated = await CategoryApi.update(editingItem.id, categoryForm, token);
        setCategories(categories.map(c => c.id === editingItem.id ? updated : c));
        Swal.fire('Actualizada', 'Categoría actualizada exitosamente', 'success');
      } else {
        const newCategory = await CategoryApi.create(categoryForm, token);
        setCategories([...categories, newCategory]);
        Swal.fire('Creada', 'Categoría creada exitosamente', 'success');
      }
      resetForm();
    } catch (error) {
      Swal.fire('Error', 'No se pudo guardar la categoría', 'error');
    }
  };

  const deleteCategory = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar categoría?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    
    if (result.isConfirmed) {
      try {
        await CategoryApi.remove(id, token);
        setCategories(categories.filter(c => c.id !== id));
        Swal.fire('Eliminada', 'Categoría eliminada exitosamente', 'success');
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar la categoría', 'error');
      }
    }
  };

  // Funciones auxiliares
  const resetForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setTransactionForm({
      type: 'income',
      regularity: 'static',
      description: '',
      amount: '',
      categoryId: ''
    });
    setScheduleForm({
      type: 'income',
      regularity: 'static',
      description: '',
      amount: '',
      categoryId: '',
      periodicity: '30 day',
      nextOccurrence: '',
      endDate: ''
    });
    setCategoryForm({
      name: '',
      description: '',
      type: 'income'
    });
  };

  const openForm = (type, item = null) => {
    setFormType(type);
    setEditingItem(item);
    if (item) {
      if (type === 'transaction') {
        setTransactionForm({
          type: item.type,
          regularity: item.regularity,
          description: item.description,
          amount: item.amount,
          categoryId: item.categoryId
        });
      } else if (type === 'schedule') {
        setScheduleForm({
          type: item.type,
          regularity: item.regularity,
          description: item.description,
          amount: item.amount,
          categoryId: item.categoryId,
          periodicity: item.periodicity,
          nextOccurrence: item.nextOccurrence?.slice(0, 10) || '',
          endDate: item.endDate?.slice(0, 10) || ''
        });
      } else if (type === 'category') {
        setCategoryForm({
          name: item.name,
          description: item.description,
          type: item.type
        });
      }
    }
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Gestión de Transacciones</h1>
      
      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b">
        <button
          className={`px-4 py-2 font-semibold ${activeTab === 'historicas' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('historicas')}
        >
          Transacciones Históricas
        </button>
        <button
          className={`px-4 py-2 font-semibold ${activeTab === 'programadas' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('programadas')}
        >
          Transacciones Programadas
        </button>
        <button
          className={`px-4 py-2 font-semibold ${activeTab === 'categorias' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('categorias')}
        >
          Categorías
        </button>
      </div>

      {/* Botón agregar */}
      <div className="mb-6">
        <button
          onClick={() => {
            if (activeTab === 'historicas') openForm('transaction');
            else if (activeTab === 'programadas') openForm('schedule');
            else if (activeTab === 'categorias') openForm('category');
          }}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
        >
          + Agregar {activeTab === 'historicas' ? 'Transacción' : activeTab === 'programadas' ? 'Transacción Programada' : 'Categoría'}
        </button>
      </div>

      {/* Contenido de tabs */}
      {activeTab === 'historicas' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Transacciones Históricas</h2>
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
                {transactions.map(transaction => (
                  <tr key={transaction.id} className="border-b">
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-sm ${transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {transaction.type === 'income' ? 'Ingreso' : 'Egreso'}
                      </span>
                    </td>
                    <td className="px-4 py-2">{transaction.description}</td>
                    <td className="px-4 py-2">${transaction.amount}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-sm ${transaction.regularity === 'static' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {transaction.regularity === 'static' ? 'Fijo' : 'Variable'}
                      </span>
                    </td>
                    <td className="px-4 py-2">{new Date(transaction.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => openForm('transaction', transaction)}
                        className="text-blue-600 hover:text-blue-800 mr-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => deleteTransaction(transaction.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {transactions.length === 0 && (
              <div className="text-center py-8 text-gray-500">No hay transacciones históricas</div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'programadas' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Transacciones Programadas</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Tipo</th>
                  <th className="px-4 py-2 text-left">Descripción</th>
                  <th className="px-4 py-2 text-left">Monto</th>
                  <th className="px-4 py-2 text-left">Periodicidad</th>
                  <th className="px-4 py-2 text-left">Próxima</th>
                  <th className="px-4 py-2 text-left">Estado</th>
                  <th className="px-4 py-2 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {scheduleTransactions.map(schedule => (
                  <tr key={schedule.id} className="border-b">
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-sm ${schedule.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {schedule.type === 'income' ? 'Ingreso' : 'Egreso'}
                      </span>
                    </td>
                    <td className="px-4 py-2">{schedule.description}</td>
                    <td className="px-4 py-2">${schedule.amount}</td>
                    <td className="px-4 py-2">{schedule.periodicity}</td>
                    <td className="px-4 py-2">{schedule.nextOccurrence ? new Date(schedule.nextOccurrence).toLocaleDateString() : '-'}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-sm ${schedule.status ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {schedule.status ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => openForm('schedule', schedule)}
                        className="text-blue-600 hover:text-blue-800 mr-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => deleteScheduleTransaction(schedule.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {scheduleTransactions.length === 0 && (
              <div className="text-center py-8 text-gray-500">No hay transacciones programadas</div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'categorias' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Categorías</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(category => (
              <div key={category.id} className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg">{category.name}</h3>
                <p className="text-gray-600 mb-2">{category.description}</p>
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-1 rounded text-sm ${category.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {category.type === 'income' ? 'Ingreso' : 'Egreso'}
                  </span>
                  <div>
                    <button
                      onClick={() => openForm('category', category)}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => deleteCategory(category.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {categories.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">No hay categorías</div>
            )}
          </div>
        </div>
      )}

      {/* Modal de formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">
              {editingItem ? 'Editar' : 'Crear'} {
                formType === 'transaction' ? 'Transacción' :
                formType === 'schedule' ? 'Transacción Programada' : 'Categoría'
              }
            </h3>

            {formType === 'transaction' && (
              <form onSubmit={handleTransactionSubmit} className="space-y-4">
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
                    onClick={resetForm}
                    className="flex-1 bg-gray-400 text-white py-2 rounded-md hover:bg-gray-500 transition"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            {formType === 'schedule' && (
              <form onSubmit={handleScheduleSubmit} className="space-y-4">
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
                    onClick={resetForm}
                    className="flex-1 bg-gray-400 text-white py-2 rounded-md hover:bg-gray-500 transition"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            {formType === 'category' && (
              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select
                    value={categoryForm.type}
                    onChange={(e) => setCategoryForm({...categoryForm, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="income">Ingreso</option>
                    <option value="expense">Egreso</option>
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
                    onClick={resetForm}
                    className="flex-1 bg-gray-400 text-white py-2 rounded-md hover:bg-gray-500 transition"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
