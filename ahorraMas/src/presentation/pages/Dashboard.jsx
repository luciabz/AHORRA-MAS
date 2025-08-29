import mockUser from '../../shared/constants/mockUser.json';
import { getDiasRestantes } from '../../shared/utils/getDiasRestantes';

export default function Dashboard() {
  // Calcular días restantes para la meta de ahorro usando utilidad
  const diasRestantes = getDiasRestantes(mockUser.ahorro.fechaLimite);
  const ingresoTotal = mockUser.ingreso.monto + (mockUser.transacciones.filter(t => t.tipo === 'ingreso').reduce((acc, t) => acc + t.monto, 0)) + mockUser.sobranteMesAnterior;
  const gastoFijoTotal = mockUser.gastosFijos.reduce((acc, g) => acc + g.monto, 0);
  const ahorro = mockUser.ahorro.acumulado;
  const sobranteParaGastar = ingresoTotal - gastoFijoTotal - ahorro;
  const fechaActual = new Date();
  const mesActual = fechaActual.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
  const tieneIngresoFijo = mockUser.ingreso.tipo === 'fijo';

  return (
    <main className="min-h-screen w-screen text-black bg-gray-50 p-6">
      <header>
        <h1 className="text-3xl font-bold text-black mb-2">Resumen Financiero</h1>
        <p className="text-lg mb-2">Bienvenida, {mockUser.nombre}</p>
        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
          <span className="text-base font-semibold text-blue-700">Mes actual: {mesActual.charAt(0).toUpperCase() + mesActual.slice(1)}</span>
          {tieneIngresoFijo ? (
            <span className="text-base text-green-700 flex items-center gap-2">Ingreso fijo: <span className="font-bold">${mockUser.ingreso.monto}</span>
              <button type="button" className="p-1 rounded-full hover:bg-yellow-100" aria-label="Editar ingreso fijo">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
              </button>
            </span>
          ) : (
            <span className="text-base text-blue-700 flex items-center gap-2">Ingresos variables:
              <button type="button" className="p-1 rounded-full hover:bg-yellow-100" aria-label="Editar ingresos variables">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
              </button>
              <button type="button" className="ml-2 bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 text-sm" aria-label="Agregar ingreso variable">
                + Agregar variable
              </button>
            </span>
          )}
          <button type="button" className="ml-2 bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 text-sm" aria-label="Agregar ingreso extra">
            + Agregar ingreso extra
          </button>
          <button type="button" className="ml-2 bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 text-sm" aria-label="Agregar sobrante">
            + Agregar sobrante
          </button>
        </div>
      </header>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8" aria-label="Resumen de totales">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Ingreso Total</h2>
          <div className="text-2xl font-bold text-green-600">${ingresoTotal}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Gasto Fijo Total</h2>
          <div className="text-2xl font-bold text-red-600">${gastoFijoTotal}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Ahorro</h2>
          <div className="text-2xl font-bold text-blue-600">${ahorro}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Sobrante para Gastar</h2>
          <div className="text-2xl font-bold text-yellow-600">${sobranteParaGastar}</div>
        </div>
        <div className="bg-white p-4 rounded shadow flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold mb-2">Cuenta regresiva</h2>
          <div className="text-2xl font-bold text-red-600">{diasRestantes} días</div>
          <span className="text-xs text-gray-500">para la meta de ahorro</span>
        </div>
      </section>
      <section className="bg-white p-6 rounded shadow mb-6" aria-labelledby="detalle-ingresos-gastos">
        <h2 id="detalle-ingresos-gastos" className="text-xl font-semibold mb-4">Detalle de Ingresos y Gastos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold mb-2">Ingresos</h3>
            <ul className="list-disc pl-5 text-gray-700">
              {tieneIngresoFijo ? (
                <li>Ingreso fijo: ${mockUser.ingreso.monto}</li>
              ) : (
                <li>Ingresos variables:
                  <ul className="list-disc pl-5">
                    {mockUser.ingreso.variable.map((v, idx) => (
                      <li key={idx}>{v.mes}: ${v.monto}</li>
                    ))}
                  </ul>
                </li>
              )}
              <li>Acumulado mes anterior: ${mockUser.sobranteMesAnterior}
                <button type="button" className="ml-2 bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 text-xs" aria-label="Agregar sobrante">
                  + Agregar
                </button>
              </li>
              <li>Ingresos extras: {mockUser.transacciones.filter(t => t.tipo === 'ingreso').map(t => `$${t.monto} (${t.descripcion})`).join(', ') || 'Ninguno'}
                <button type="button" className="ml-2 bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 text-xs" aria-label="Agregar ingreso extra">
                  + Agregar
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">Gastos Fijos</h3>
            <ul className="list-disc pl-5 text-gray-700">
              {mockUser.gastosFijos.map(g => (
                <li key={g.id}>{g.nombre}: ${g.monto} {g.pagado ? '(Pagado)' : ''}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="bg-white p-6 rounded shadow" aria-labelledby="meta-ahorro">
        <h2 id="meta-ahorro" className="text-xl font-semibold mb-4">Meta de Ahorro</h2>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <span className="block text-gray-700 mb-2">Meta: ${mockUser.ahorro.meta}</span>
            <span className="block text-gray-700 mb-2">Fecha límite: {mockUser.ahorro.fechaLimite}</span>
            <span className="block text-gray-700 mb-2">Porcentaje recomendado: {mockUser.ahorro.porcentaje}%</span>
            <span className="block text-gray-700 mb-2">Estado: {mockUser.ahorro.estado}</span>
            <span className="block text-red-600 font-bold mt-2">Faltan {diasRestantes} días para cumplir la meta</span>
          </div>
          <div>
            <button type="button" className="p-2 rounded-full hover:bg-yellow-100" aria-label="Editar Meta">
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
