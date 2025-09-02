export default function TablaGastosFijos({ gastos }) {
  return (
    <table className="w-full table-auto mt-2">
      <thead>
        <tr className="bg-gray-200">
          <th className="px-4 py-2">Nombre</th>
          <th className="px-4 py-2">Monto</th>
          <th className="px-4 py-2">Pagado</th>
          <th className="px-4 py-2">Fecha de Pago</th>
          <th className="px-4 py-2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {gastos.map(gasto => (
          <tr key={gasto.id}>
            <td className="px-4 py-2 text-center">{gasto.nombre}</td>
            <td className="px-4 py-2 text-center">${gasto.monto}</td>
            <td className="px-4 py-2 text-center">{gasto.pagado ? 'Sí' : 'No'}</td>
            <td className="px-4 py-2 text-center">{gasto.fechaPago || '-'}</td>
            <td className="px-4 py-2 space-x-2 text-center">
              <button type="button" className="p-2 rounded-full hover:bg-yellow-100" aria-label="Editar">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-yellow-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
              </button>
              <button type="button" className="p-2 rounded-full hover:bg-green-100" aria-label="Marcar como pagado">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button type="button" className="p-2 rounded-full hover:bg-red-200" aria-label="Omitir">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
