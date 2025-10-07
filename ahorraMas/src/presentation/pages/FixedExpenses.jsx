
import React, { useState, useEffect } from 'react';

import Navbar from '../components/Navbar';
import SelectorMesBusqueda from '../components/fixedExpenses/SelectorMesBusqueda';
import FormGastoFijo from '../components/fixedExpenses/FormGastoFijo';
import TablaGastosFijos from '../components/fixedExpenses/TablaGastosFijos';
import { useScheduledTransactions } from '../hooks/useScheduledTransactions';
import { useCategories } from '../hooks/useCategories';

export default function FixedExpenses() {
  const [showForm, setShowForm] = useState(false);
  const [mesSeleccionado, setMesSeleccionado] = useState(() => {
    const hoy = new Date();
    const yearMonth = hoy.toISOString().slice(0, 7);
    return yearMonth;
  });

  const { 
    scheduledTransactions, 
    loading: scheduledLoading, 
    error: scheduledError,
    addScheduledTransaction 
  } = useScheduledTransactions();
  
  const { 
    categories, 
    loading: categoriesLoading, 
    error: categoriesError 
  } = useCategories();

  const loading = scheduledLoading || categoriesLoading;
  
  const formatSelectedMonth = (mesSeleccionado) => {
    if (!mesSeleccionado) return '';
    const [year, month] = mesSeleccionado.split('-');
    const monthNames = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    return `${monthNames[parseInt(month) - 1]} de ${year}`;
  };
  
  const gastosFijos = scheduledTransactions.filter(transaction => {
    const isExpense = transaction.tipo === 'expense' || 
                     transaction.type === 'expense' ||
                     transaction.tipo === 'egreso';
    
    if (!isExpense) return false;
    
    if (mesSeleccionado && transaction.nextOccurrence) {
      const transactionYearMonth = transaction.nextOccurrence.substring(0, 7); // "2025-10"
      

      
      return transactionYearMonth === mesSeleccionado;
    }
    
    return true; 
  }).map(transaction => {
    const category = categories.find(cat => cat.id === transaction.categoryId);
    return {
      ...transaction,
      category: category ? { name: category.name } : null
    };
  });

  const handleGastoCreated = () => {
    setShowForm(false);
    // Los hooks se actualizarán automáticamente
  };

  return (
    <>
      <Navbar />
      <main className="text-black bg-gray-50 p-4 sm:p-6">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Gastos Fijos</h1>
      </header>
      <section className="bg-white p-4 sm:p-6 rounded shadow" aria-labelledby="tabla-gastos-fijos">
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 id="tabla-gastos-fijos" className="text-lg sm:text-xl font-semibold">Listado de Gastos Fijos</h2>
            <button
              type="button"
              className={`px-4 py-2 sm:py-2 rounded cursor-pointer text-sm flex items-center justify-center gap-2 transition-colors ${showForm ? 'bg-red-700 text-white hover:bg-red-800' : 'bg-green-800 text-white hover:bg-green-700'}`}
              onClick={() => setShowForm((prev) => !prev)}
              aria-label={showForm ? 'Cerrar formulario' : 'Agregar gasto fijo'}
            >
              {showForm ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Cerrar</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Agregar</span>
                </>
              )}
            </button>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label htmlFor="mes-selector" className="text-sm font-medium text-gray-700 sm:mr-2">
              Filtrar por mes:
            </label>
            <SelectorMesBusqueda mesSeleccionado={mesSeleccionado} setMesSeleccionado={setMesSeleccionado} />
            {mesSeleccionado && (
              <span className="text-sm text-gray-600 bg-blue-50 px-2 py-1 rounded">
                Mostrando gastos para: {formatSelectedMonth(mesSeleccionado)}
              </span>
            )}
          </div>
        </div>
        {showForm && (
          <div className="mb-6 w-full mx-auto bg-gray-50 rounded-lg shadow p-4 sm:p-6 border border-gray-200 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Agregar Gasto Fijo</h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-700 p-1 hover:bg-gray-200 rounded transition-colors"
                onClick={() => setShowForm(false)}
                aria-label="Cerrar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <FormGastoFijo onGastoCreated={handleGastoCreated} />
          </div>
        )}
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
            <span className="ml-2">Cargando gastos fijos...</span>
          </div>
        ) : (
          <TablaGastosFijos gastos={gastosFijos} onGastoUpdated={() => {}} />
        )}
      </section>
      </main>
    </>
  );
}
