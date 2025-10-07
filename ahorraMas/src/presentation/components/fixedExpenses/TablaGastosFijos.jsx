import React from 'react';
import Swal from 'sweetalert2';

export default function TablaGastosFijos({ gastos, onGastoUpdated }) {
  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        const token = localStorage.getItem('token');
        await ScheduleTransactionApi.remove(id, token);
        
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El gasto fijo ha sido eliminado correctamente'
        });

        if (onGastoUpdated) {
          onGastoUpdated();
        }
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el gasto fijo'
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const getPeriodicityLabel = (periodicity) => {
    const periodicityMap = {
      '7 day': 'Semanal',
      '15 day': 'Quincenal',
      '30 day': 'Mensual',
      '1 year': 'Anual'
    };
    return periodicityMap[periodicity] || periodicity;
  };

  const getRegularityLabel = (regularity) => {
    const regularityMap = {
      'static': 'Estático',
      'variable': 'Variable',
      'extra': 'Extra'
    };
    return regularityMap[regularity] || regularity;
  };

  if (gastos.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-500 text-lg mb-2">No hay gastos fijos registrados</p>
          <p className="text-gray-400 text-sm">Agrega tu primer gasto fijo para comenzar a gestionar tus gastos recurrentes</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Vista de tabla para desktop */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Regularidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Periodicidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Próxima ocurrencia
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha fin
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {gastos.map((gasto) => (
              <tr key={gasto.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{gasto.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-red-600 font-semibold">
                    -{formatAmount(gasto.amount)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {gasto.category?.name || 'Sin categoría'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {getRegularityLabel(gasto.regularity)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {getPeriodicityLabel(gasto.periodicity)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatDate(gasto.nextOccurrence)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {gasto.endDate ? formatDate(gasto.endDate) : 'Indefinido'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleDelete(gasto.id)}
                      className="text-red-600 hover:text-red-900 transition-colors p-1 rounded hover:bg-red-50"
                      title="Eliminar gasto fijo"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden space-y-4">
        {gastos.map((gasto) => (
          <div
            key={gasto.id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 text-lg mb-1">
                  {gasto.description}
                </h3>
                <div className="text-lg font-semibold text-red-600">
                  -{formatAmount(gasto.amount)}
                </div>
              </div>
              <button
                onClick={() => handleDelete(gasto.id)}
                className="text-red-600 hover:text-red-900 transition-colors p-2 rounded hover:bg-red-50 ml-2"
                title="Eliminar gasto fijo"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 block">Categoría:</span>
                <span className="text-gray-900 font-medium">
                  {gasto.category?.name || 'Sin categoría'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">Regularidad:</span>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {getRegularityLabel(gasto.regularity)}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">Periodicidad:</span>
                <span className="text-gray-900 font-medium">
                  {getPeriodicityLabel(gasto.periodicity)}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">Próxima:</span>
                <span className="text-gray-900 font-medium">
                  {formatDate(gasto.nextOccurrence)}
                </span>
              </div>
            </div>

            {gasto.endDate && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <span className="text-gray-500 text-sm">Fecha fin: </span>
                <span className="text-gray-700 text-sm font-medium">
                  {formatDate(gasto.endDate)}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
