import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useTransactions, useCategories, useScheduledTransactions } from '../../hooks';

import HistoricalTransactions from './HistoricalTransactions';
import ScheduledTransactions from './ScheduledTransactions';
import CategoriesManager from './CategoriesManager';
import TransactionModal from './TransactionModal';

export default function TransactionManager() {
  // Hooks de Clean Architecture
  const { 
    transactions, 
    loading: transactionLoading, 
    error: transactionError,
    loadTransactions,
    addTransaction: createTransactionUseCase,
    editTransaction: updateTransactionUseCase,
    removeTransaction: deleteTransactionUseCase
  } = useTransactions();

  const {
    categories,
    loading: categoryLoading,
    error: categoryError,
    loadCategories,
    addCategory: createCategoryUseCase,
    editCategory: updateCategoryUseCase,
    removeCategory: deleteCategoryUseCase
  } = useCategories();

  const {
    scheduledTransactions,
    loading: scheduleLoading,
    addScheduledTransaction,
    editScheduledTransaction,
    removeScheduledTransaction
  } = useScheduledTransactions();

  // Estados locales del componente
  const [activeTab, setActiveTab] = useState('historicas'); 
  const [showForm, setShowForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formType, setFormType] = useState('transaction'); 

  // Estados combinados
  const loading = transactionLoading || categoryLoading || scheduleLoading;
  const error = transactionError || categoryError;

  // Obtener userId del token (simplificado - en producción usar contexto)
  const getUserId = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user_id || payload.id;
    } catch {
      return null;
    }
  };

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

  // Los datos se cargan automáticamente a través de los hooks
  useEffect(() => {
    // Los hooks ya cargan los datos automáticamente, solo necesitamos validar autenticación
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire('Error', 'No se encontró token de autenticación', 'error');
      return;
    }
  }, []);

  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    try {
      const transactionData = { 
        ...transactionForm, 
        date: new Date().toISOString() // Agregar fecha actual
      };

      let result;
      if (editingItem) {
        result = await updateTransactionUseCase(editingItem.id, transactionData);
        if (result.success) {
          Swal.fire('Actualizada', 'Transacción actualizada exitosamente', 'success');
        } else {
          throw new Error(result.message);
        }
      } else {
        result = await createTransactionUseCase(transactionData);
        if (result.success) {
          Swal.fire('Creada', 'Transacción creada exitosamente', 'success');
        } else {
          throw new Error(result.message);
        }
      }
      resetForm();
    } catch (error) {
      console.error('Error saving transaction:', error);
      Swal.fire('Error', error.message || 'No se pudo guardar la transacción', 'error');
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
        const deleteResult = await deleteTransactionUseCase(id);
        if (deleteResult.success) {
          Swal.fire('Eliminada', 'Transacción eliminada exitosamente', 'success');
        } else {
          throw new Error(deleteResult.message);
        }
      } catch (error) {
        console.error('Error deleting transaction:', error);
        Swal.fire('Error', error.message || 'No se pudo eliminar la transacción', 'error');
      }
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      let result;
      if (editingItem) {
        result = await editScheduledTransaction(editingItem.id, scheduleForm);
        if (result.success) {
          Swal.fire('Actualizada', 'Transacción programada actualizada exitosamente', 'success');
        } else {
          throw new Error(result.message);
        }
      } else {
        result = await addScheduledTransaction(scheduleForm);
        if (result.success) {
          Swal.fire('Creada', 'Transacción programada creada exitosamente', 'success');
        } else {
          throw new Error(result.message);
        }
      }
      resetForm();
    } catch (error) {
      console.error('Error saving scheduled transaction:', error);
      Swal.fire('Error', error.message || 'No se pudo guardar la transacción programada', 'error');
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
        const deleteResult = await removeScheduledTransaction(id);
        if (deleteResult.success) {
          Swal.fire('Eliminada', 'Transacción programada eliminada exitosamente', 'success');
        } else {
          throw new Error(deleteResult.message);
        }
      } catch (error) {
        console.error('Error deleting scheduled transaction:', error);
        Swal.fire('Error', error.message || 'No se pudo eliminar la transacción programada', 'error');
      }
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      let result;
      if (editingItem) {
        result = await updateCategoryUseCase(editingItem.id, categoryForm);
        if (result.success) {
          Swal.fire('Actualizada', 'Categoría actualizada exitosamente', 'success');
        } else {
          throw new Error(result.message);
        }
      } else {
        result = await createCategoryUseCase(categoryForm);
        if (result.success) {
          Swal.fire('Creada', 'Categoría creada exitosamente', 'success');
        } else {
          throw new Error(result.message);
        }
      }
      setShowCategoryForm(false);
      setEditingItem(null);
      setCategoryForm({ name: '', description: '', type: 'income' });
    } catch (error) {
      console.error('Error saving category:', error);
      Swal.fire('Error', error.message || 'No se pudo guardar la categoría', 'error');
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
        const deleteResult = await deleteCategoryUseCase(id);
        if (deleteResult.success) {
          Swal.fire('Eliminada', 'Categoría eliminada exitosamente', 'success');
        } else {
          throw new Error(deleteResult.message);
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        Swal.fire('Error', error.message || 'No se pudo eliminar la categoría', 'error');
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setShowCategoryForm(false);
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
    
    if (type === 'category') {
      setShowCategoryForm(true);
    } else {
      setShowForm(true);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  return (
    <div className=" mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Gestión de Transacciones</h1>
      
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


      {activeTab === 'historicas' && (
        <HistoricalTransactions 
          transactions={transactions}
          onEdit={(transaction) => openForm('transaction', transaction)}
          onDelete={deleteTransaction}
        />
      )}

      {activeTab === 'programadas' && (
        <ScheduledTransactions 
          scheduleTransactions={scheduledTransactions}
          onEdit={(schedule) => openForm('schedule', schedule)}
          onDelete={deleteScheduleTransaction}
        />
      )}

      {activeTab === 'categorias' && (
        <CategoriesManager 
          categories={categories}
          showCategoryForm={showCategoryForm}
          setShowCategoryForm={setShowCategoryForm}
          categoryForm={categoryForm}
          setCategoryForm={setCategoryForm}
          editingItem={editingItem}
          setEditingItem={setEditingItem}
          onSubmit={handleCategorySubmit}
          onEdit={(category) => openForm('category', category)}
          onDelete={deleteCategory}
        />
      )}

      <TransactionModal 
        showForm={showForm}
        formType={formType}
        editingItem={editingItem}
        transactionForm={transactionForm}
        setTransactionForm={setTransactionForm}
        scheduleForm={scheduleForm}
        setScheduleForm={setScheduleForm}
        categories={categories}
        onTransactionSubmit={handleTransactionSubmit}
        onScheduleSubmit={handleScheduleSubmit}
        onCancel={resetForm}
      />
    </div>
  );
}
