import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useTransactions } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';
import Swal from 'sweetalert2';

export default function VariableIncome() {
  const [showForm, setShowForm] = useState(false);
  const [ingresosVariables, setIngresosVariables] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    categoryId: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([
      loadVariableIncomes(),
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

  const loadVariableIncomes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (token) {
        const data = await TransactionApi.list(token);
        // Filtrar solo los ingresos variables (type: 'income' y regularity: 'variable')
        const variableIncomeTransactions = data.filter(transaction => 
          transaction.type === 'income' && transaction.regularity === 'variable'
        );
        
        // Mapear las transacciones con los nombres de categoría
        const transactionsWithCategories = variableIncomeTransactions.map(transaction => {
          const category = categories.find(cat => cat.id === transaction.categoryId);
          return {
            ...transaction,
            category: category ? { name: category.name } : null
          };
        });
        
        setIngresosVariables(transactionsWithCategories);
      }
    } catch (error) {
      console.error('Error al cargar ingresos variables:', error);
      setIngresosVariables([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.description || !formData.amount || !formData.categoryId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor complete todos los campos'
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const transactionData = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        categoryId: parseInt(formData.categoryId),
        type: 'income',
        regularity: 'variable'
      };

      await TransactionApi.create(transactionData, token);
      
      Swal.fire({
        title: '¡Éxito!',
        text: 'Ingreso variable agregado correctamente',
        icon: 'success',
        confirmButtonColor: '#16a34a'
      });

      setFormData({ description: '', amount: '', categoryId: '' });
      setShowForm(false);
      loadData();
    } catch (error) {
      console.error('Error al guardar ingreso:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo guardar el ingreso variable',
        icon: 'error',
        confirmButtonColor: '#dc2626'
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await TransactionApi.remove(id, token);
        
        Swal.fire({
          title: '¡Eliminado!',
          text: 'El ingreso ha sido eliminado',
          icon: 'success',
          confirmButtonColor: '#16a34a'
        });

        loadData();
      } catch (error) {
        console.error('Error al eliminar:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar el ingreso',
          icon: 'error',
          confirmButtonColor: '#dc2626'
        });
      }
    }
  };
  return (
    <>
      <Navbar />
      <main className="text-black bg-gray-50 p-6">
      <header>
        <h1 className="text-3xl font-bold mb-6">Ingresos Variables</h1>
      </header>
      <section className="bg-white p-6 rounded shadow" aria-labelledby="tabla-ingresos-variables">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h2 id="tabla-ingresos-variables" className="text-xl font-semibold">Listado de Ingresos Variables</h2>
          <button
            type="button"
            className={`px-4 py-2 rounded cursor-pointer text-sm flex items-center gap-2 ${showForm ? 'bg-red-700 text-white hover:bg-red-800' : 'bg-green-800 text-white hover:bg-green-700'}`}
            onClick={() => setShowForm((prev) => !prev)}
            aria-label={showForm ? 'Cerrar formulario' : 'Agregar ingreso variable'}
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
                <span className="text-lg">+ Agregar</span>
              </>
            )}
          </button>
        </div>
        {showForm && (
          <div className="mb-6 w-full mx-auto bg-white rounded-lg shadow p-6 animate-fade-in">
            <div className="flex justify-between mb-2">
              <h3 className="text-lg font-semibold">Agregar Ingreso Variable</h3>
             
            </div>
            <form className="grid grid-cols-1 md:grid-cols-4 gap-4" onSubmit={handleSubmit}>
              <input 
                type="text" 
                placeholder="Descripción (ej: Freelance, venta, comisión)" 
                className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
              <input 
                type="number" 
                placeholder="Monto" 
                className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                required
                min="0"
                step="0.01"
              />
              <select
                className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.categoryId}
                onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                required
              >
                <option value="">Seleccionar categoría</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <input type="submit" value="Guardar" className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition cursor-pointer" />
            </form>
          </div>
        )}
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
            <span className="ml-2">Cargando ingresos variables...</span>
          </div>
        ) : (
          <table className="w-full table-auto mt-2">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ingresosVariables && ingresosVariables.length > 0 ? (
                ingresosVariables.map((ingreso) => (
                  <tr key={ingreso.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{ingreso.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-green-600 font-semibold">
                        +${parseFloat(ingreso.amount).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {ingreso.category?.name || 'Sin categoría'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(ingreso.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        type="button" 
                        className="text-red-600 hover:text-red-900 transition-colors p-1 rounded hover:bg-red-50" 
                        aria-label="Eliminar ingreso variable"
                        onClick={() => handleDelete(ingreso.id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center text-gray-500 py-8">
                    <div className="flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-lg mb-2">No hay ingresos variables registrados</p>
                      <p className="text-sm">Agrega tus ingresos variables como freelance, comisiones o bonos</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </section>
      </main>
    </>
  );
}
