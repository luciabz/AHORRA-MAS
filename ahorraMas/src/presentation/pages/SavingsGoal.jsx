import { getDiasRestantes } from '../../shared/utils/getDiasRestantes';
import mockUser from '../../shared/constants/mockUser.json';

export default function SavingsGoal() {
  const diasRestantes = getDiasRestantes(mockUser.ahorro.fechaLimite);
  const porcentajeAhorro = Math.min(Math.round((mockUser.ahorro.acumulado / mockUser.ahorro.meta) * 100), 100);
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
            <span className="block text-gray-700 mb-2">Meta: ${mockUser.ahorro.meta}</span>
            <span className="block text-gray-700 mb-2">Fecha límite: {mockUser.ahorro.fechaLimite}</span>
            <span className="block text-gray-700 mb-2">Porcentaje recomendado: {mockUser.ahorro.porcentaje}%</span>
            <span className="block text-gray-700 mb-2">Estado: {mockUser.ahorro.estado}</span>
            <span className="block text-red-600 font-bold mt-2">Faltan {diasRestantes} días para cumplir la meta</span>
            <div className="mt-4">
              <span className="block text-sm text-gray-600 mb-1">Progreso hacia la meta: {porcentajeAhorro}%</span>
              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-4 bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${porcentajeAhorro}%` }}
                ></div>
              </div>
              <span className="block text-xs text-gray-500 mt-1">Ahorro acumulado: ${mockUser.ahorro.acumulado}</span>
            </div>
          </div>
          <div>
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
          </div>
        </div>
      </section>
    </main>
  );
}
