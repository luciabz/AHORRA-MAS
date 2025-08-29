export default function SavingsGoal() {
  return (
    <main className="min-h-screen w-screen text-black bg-gray-50 p-6">
      <header>
        <h1 className="text-3xl font-bold mb-6">Meta de Ahorro</h1>
      </header>
      <section className="bg-white p-6 rounded shadow mb-6" aria-labelledby="definir-meta">
        <h2 id="definir-meta" className="text-xl font-semibold mb-4">Definir Meta de Ahorro</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="monto-objetivo" className="block text-gray-700 mb-2">Monto objetivo</label>
            <input id="monto-objetivo" name="monto-objetivo" type="number" className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label htmlFor="fecha-limite" className="block text-gray-700 mb-2">Fecha límite</label>
            <input id="fecha-limite" name="fecha-limite" type="date" className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label htmlFor="porcentaje-ahorro" className="block text-gray-700 mb-2">Porcentaje de ahorro mensual</label>
            <input id="porcentaje-ahorro" name="porcentaje-ahorro" type="number" className="w-full px-3 py-2 border rounded" />
          </div>
          <div className="md:col-span-2 flex justify-end mt-4">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Guardar Meta</button>
          </div>
        </form>
      </section>
      <section className="bg-white p-6 rounded shadow" aria-labelledby="estado-meta">
        <h2 id="estado-meta" className="text-xl font-semibold mb-4">Estado de la Meta</h2>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <span className="block text-gray-700 mb-2">Meta: $0</span>
            <span className="block text-gray-700 mb-2">Fecha límite: --/--/----</span>
            <span className="block text-gray-700 mb-2">Porcentaje recomendado: 10%</span>
            <span className="block text-gray-700 mb-2">Estado: Adecuado</span>
          </div>
          <div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Editar</button>
          </div>
        </div>
      </section>
    </main>
  );
}
