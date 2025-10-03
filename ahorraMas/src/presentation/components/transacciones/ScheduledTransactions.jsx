
export default function ScheduledTransactions({ 
  scheduleTransactions, 
  onEdit, 
  onDelete 
}) {
  return (
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
                    onClick={() => onEdit(schedule)}
                    className="text-blue-600 hover:text-blue-800 mr-3 inline-flex items-center"
                    title="Editar transacción programada"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(schedule.id)}
                    className="text-red-600 hover:text-red-800 inline-flex items-center"
                    title="Eliminar transacción programada"
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
        {scheduleTransactions.length === 0 && (
          <div className="text-center py-8 text-gray-500">No hay transacciones programadas</div>
        )}
      </div>
    </div>
  );
}
