import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SelectorMesBusqueda from '../components/fixedExpenses/SelectorMesBusqueda';
import FormGastoFijo from '../components/fixedExpenses/FormGastoFijo';
import TablaGastosFijos from '../components/fixedExpenses/TablaGastosFijos';
import { ScheduleTransactionApi } from '../../infrastructure/api/scheduleTransactionApi';
import { CategoryApi } from '../../infrastructure/api/categoryApi';

export default function FixedExpenses() {
  const [showForm, setShowForm] = useState(false);
  const [mesSeleccionado, setMesSeleccionado] = useState(() => {
    const hoy = new Date();
    return hoy.toISOString().slice(0, 7);
  });
  const [gastosFijos, setGastosFijos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([
      loadScheduledTransactions(),
      loadCategories()
    ]);
  };

  const loadCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const data = await CategoryApi.list(token);
        setCategories(data);
      }
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      setCategories([]);
    }
  };

  const loadScheduledTransactions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (token) {
        const data = await ScheduleTransactionApi.list(token);
        // Filtrar solo los gastos (tipo 'egreso')
        const expenseTransactions = data.filter(transaction => 
          transaction.tipo === 'egreso' || transaction.type === 'expense'
        );
        
        // Mapear las transacciones con los nombres de categoría
        const transactionsWithCategories = expenseTransactions.map(transaction => {
          const category = categories.find(cat => cat.id === transaction.categoryId);
          return {
            ...transaction,
            category: category ? { name: category.name } : null
          };
        });
        
        setGastosFijos(transactionsWithCategories);
      }
    } catch (error) {
      console.error('Error al cargar transacciones programadas:', error);
      setGastosFijos([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="text-black bg-gray-50 p-6">
      <header>
        <h1 className="text-3xl font-bold mb-6">Gastos Fijos</h1>
      </header>
      <section className="bg-white p-6 rounded shadow" aria-labelledby="tabla-gastos-fijos">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <h2 id="tabla-gastos-fijos" className="text-xl font-semibold">Listado de Gastos Fijos</h2>
            <SelectorMesBusqueda mesSeleccionado={mesSeleccionado} setMesSeleccionado={setMesSeleccionado} />
          </div>
          <button
            type="button"
            className={`px-4 py-2 rounded cursor-pointer text-sm flex items-center gap-2 ${showForm ? 'bg-red-700 text-white hover:bg-red-800' : 'bg-green-800 text-white hover:bg-green-700'}`}
            onClick={() => setShowForm((prev) => !prev)}
            aria-label={showForm ? 'Cerrar formulario' : 'Agregar gasto fijo'}
          >
            {showForm ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-lg">Cerrar</span>
              </>
            ) : (
              <>
                <span className="text-lg">+Agregar</span>
              </>
            )}
          </button>
        </div>
        {showForm && (
          <div className="mb-6 w-full mx-auto bg-white rounded-lg shadow p-6 animate-fade-in">
            <div className="flex justify-between mb-2">
              <h3 className="text-lg font-semibold">Agregar Gasto Fijo</h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-700 text-2xl"
                onClick={() => setShowForm(false)}
                aria-label="Cerrar"
              >
              </button>
            </div>
            <FormGastoFijo onGastoCreated={() => {
              loadData();
              setShowForm(false);
            }} />
          </div>
        )}
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
            <span className="ml-2">Cargando gastos fijos...</span>
          </div>
        ) : (
          <TablaGastosFijos gastos={gastosFijos} onGastoUpdated={loadData} />
        )}
      </section>
      </main>
    </>
  );
}
