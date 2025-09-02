import React from 'react';
import mockUser from '../../shared/constants/mockUser.json';

export default function VariableIncome() {
  const [showForm, setShowForm] = React.useState(false);
  return (
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
            <form className="flex gap-4" onSubmit={e => { e.preventDefault(); /* lógica de guardado */ }}>
              <input type="text" placeholder="Mes" className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300" />
              <input type="number" placeholder="Monto" className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300" />
              <input type="submit" value="Guardar" className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition cursor-pointer" />
            </form>
          </div>
        )}
        <table className="w-full table-auto mt-2">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Descripcion</th>
              <th className="px-4 py-2">Monto</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {mockUser.ingreso.variable && mockUser.ingreso.variable.length > 0 ? (
              mockUser.ingreso.variable.map((v, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2 text-center">{v.descripcion}</td>
                  <td className="px-4 py-2 text-center">${v.monto}</td>
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
                    <button type="button" className="p-2 rounded-full hover:bg-red-200" aria-label="Eliminar">
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
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center text-gray-500 py-4">No hay ingresos variables cargados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
