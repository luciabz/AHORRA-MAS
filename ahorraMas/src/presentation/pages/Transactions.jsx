export default function Transactions() {
  return (
    <main className="min-h-screen w-screen text-black bg-gray-50 p-6">
      <header>
        <h1 className="text-3xl font-bold mb-6">Gestión de Transacciones</h1>
      </header>
      <section className="bg-white p-6 rounded shadow mb-6" aria-labelledby="form-title">
        <h2 id="form-title" className="text-xl font-semibold mb-4">Registrar Ingreso/Gasto</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="tipo" className="block text-gray-700 mb-2">Tipo</label>
            <select id="tipo" name="tipo" className="w-full px-3 py-2 border rounded">
              <option>Ingreso</option>
              <option>Gasto</option>
            </select>
          </div>
          <div>
            <label htmlFor="categoria" className="block text-gray-700 mb-2">Categoría</label>
            <select id="categoria" name="categoria" className="w-full px-3 py-2 border rounded">
              <option>Fijo</option>
              <option>Variable</option>
            </select>
          </div>
          <div>
            <label htmlFor="monto" className="block text-gray-700 mb-2">Monto</label>
            <input id="monto" name="monto" type="number" className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label htmlFor="descripcion" className="block text-gray-700 mb-2">Descripción</label>
            <input id="descripcion" name="descripcion" type="text" className="w-full px-3 py-2 border rounded" />
          </div>
          <div className="md:col-span-2 flex justify-end mt-4">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Registrar</button>
          </div>
        </form>
      </section>
      <section className="bg-white p-6 rounded shadow" aria-labelledby="list-title">
        <h2 id="list-title" className="text-xl font-semibold mb-4">Listado de Transacciones</h2>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Tipo</th>
              <th className="px-4 py-2">Categoría</th>
              <th className="px-4 py-2">Monto</th>
              <th className="px-4 py-2">Descripción</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2">--/--/----</td>
              <td className="px-4 py-2">Ingreso</td>
              <td className="px-4 py-2">Fijo</td>
              <td className="px-4 py-2">$0</td>
              <td className="px-4 py-2">Ejemplo</td>
              <td className="px-4 py-2">
                <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Editar</button>
                <button className="bg-red-500 text-white px-2 py-1 rounded">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  );
}
