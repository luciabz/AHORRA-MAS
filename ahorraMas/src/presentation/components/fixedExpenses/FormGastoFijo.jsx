import React, { useState, useEffect } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { useScheduledTransactions } from '../../hooks/useScheduledTransactions';
import Swal from 'sweetalert2';

export default function FormGastoFijo({ onSubmit, onGastoCreated }) {
  // Usar hooks personalizados
  const { categories, loading: categoriesLoading } = useCategories();
  const { addScheduledTransaction, loading: scheduledLoading } = useScheduledTransactions();
  
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    categoryId: '',
    endDate: null,
    type: 'expense', // Siempre expense para gastos fijos
    regularity: 'static',
    periodicity: '30 day',
    nextOccurrence: ''
  });

  const loading = categoriesLoading || scheduledLoading;

  useEffect(() => {
    // Establecer fecha por defecto (mañana)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setFormData(prev => ({
      ...prev,
      nextOccurrence: tomorrow.toISOString().split('T')[0]
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.description || !formData.amount || !formData.categoryId || !formData.nextOccurrence) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor complete todos los campos obligatorios'
      });
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        amount: parseFloat(formData.amount),
        categoryId: parseInt(formData.categoryId),
        endDate: formData.endDate || null
      };

      const result = await addScheduledTransaction(dataToSend);
      
      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Gasto fijo creado correctamente'
        });

        // Resetear formulario
        setFormData({
          amount: '',
          description: '',
          categoryId: '',
          endDate: null,
          type: 'expense',
          regularity: 'static',
          periodicity: '30 day',
          nextOccurrence: ''
        });

        // Notificar al componente padre
        if (onGastoCreated) {
          onGastoCreated();
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: result.message || 'Error al crear el gasto fijo'
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo crear el gasto fijo. Intente nuevamente.'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Descripción */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción *
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Ej: Alquiler, Internet, etc."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {/* Monto */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Monto *
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {/* Categoría */}
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
            Categoría *
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="">Seleccione una categoría</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Regularidad */}
        <div>
          <label htmlFor="regularity" className="block text-sm font-medium text-gray-700 mb-1">
            Regularidad
          </label>
          <select
            id="regularity"
            name="regularity"
            value={formData.regularity}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="static">Estático</option>
            <option value="variable">Variable</option>
            <option value="extra">Extra</option>
          </select>
        </div>

        {/* Periodicidad */}
        <div>
          <label htmlFor="periodicity" className="block text-sm font-medium text-gray-700 mb-1">
            Periodicidad
          </label>
          <select
            id="periodicity"
            name="periodicity"
            value={formData.periodicity}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="7 day">Semanal</option>
            <option value="15 day">Quincenal</option>
            <option value="30 day">Mensual</option>
            <option value="1 year">Anual</option>
          </select>
        </div>

        {/* Próxima ocurrencia */}
        <div>
          <label htmlFor="nextOccurrence" className="block text-sm font-medium text-gray-700 mb-1">
            Próxima ocurrencia *
          </label>
          <input
            type="date"
            id="nextOccurrence"
            name="nextOccurrence"
            value={formData.nextOccurrence}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {/* Fecha de finalización (opcional) */}
        <div className="sm:col-span-2">
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de finalización (opcional)
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              endDate: e.target.value || null
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            Si no especifica fecha, el gasto se repetirá indefinidamente
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-6 py-3 sm:py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
        >
          {loading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          )}
          {loading ? 'Guardando...' : 'Guardar Gasto Fijo'}
        </button>
      </div>
    </form>
  );
}
