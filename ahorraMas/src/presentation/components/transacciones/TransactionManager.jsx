import React, { useState, useEffect } from 'react';
import { TransactionApi } from '../../../infrastructure/api/transactionApi';
import { ScheduleTransactionApi } from '../../../infrastructure/api/scheduleTransactionApi';
import { CategoryApi } from '../../../infrastructure/api/categoryApi';
import Swal from 'sweetalert2';

import HistoricalTransactions from './HistoricalTransactions';
import ScheduledTransactions from './ScheduledTransactions';
import CategoriesManager from './CategoriesManager';
import TransactionModal from './TransactionModal';

export default function TransactionManager() {
  const [transactions, setTransactions] = useState([]);
  const [scheduleTransactions, setScheduleTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('historicas'); 
  const [showForm, setShowForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formType, setFormType] = useState('transaction'); 

  const token = localStorage.getItem('token');

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
      setShowCategoryForm(false);
      setEditingItem(null);
      setCategoryForm({ name: '', description: '', type: 'income' });
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
          scheduleTransactions={scheduleTransactions}
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
