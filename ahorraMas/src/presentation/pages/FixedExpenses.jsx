import React from 'react';
import mockUser from '../../shared/constants/mockUser.json';

export default function FixedExpenses() {
  const [showForm, setShowForm] = React.useState(false);
  return (
    <main className=" text-black bg-gray-50 p-6">
      <header>
        <h1 className="text-3xl font-bold mb-6">Gastos Fijos</h1>
      </header>
      <section className="bg-white p-6 rounded shadow" aria-labelledby="tabla-gastos-fijos">
        <div className="flex justify-between items-center mb-4">
          <h2 id="tabla-gastos-fijos" className="text-xl font-semibold">Listado de Gastos Fijos</h2>
          <button
            type="button"
            className={`px-4 py-2 rounded cursor-pointer text-sm flex items-center gap-2 ${showForm ? 'bg-red-700 text-white hover:bg-red-800' : 'bg-green-800 text-white hover:bg-green-700'}`}
            onClick={() => setShowForm((prev) => !prev)}
            aria-label={showForm ? 'Cerrar formulario' : 'Agregar gasto fijo'}
          >
            {showForm ? (
              <>
                <span className="text-lg">Cerrar</span>
              </>
            ) : (
              <>
                <span className="text-lg">Agregar</span>
              </>
            )}
          </button>
        </div>
        {showForm && (
          <div className="mb-6 w-full mx-auto bg-white  rounded-lg shadow p-6 animate-fade-in">
            <div className="flex justify-between  mb-2">
              <h3 className="text-lg font-semibold">Agregar Gasto Fijo</h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-700 text-2xl"
                onClick={() => setShowForm(false)}
                aria-label="Cerrar"
              >
                
              </button>
            </div>
            <form className="flex  gap-4">
              <input type="text" placeholder="Nombre" className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300" />
              <input type="number" placeholder="Monto" className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300" />
              <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition">Guardar</button>
            </form>
          </div>
        )}
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
            {mockUser.gastosFijos.map(gasto => (
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
      </section>
    </main>
  );
}
