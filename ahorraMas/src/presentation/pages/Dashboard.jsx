import mockUser from '../../shared/constants/mockUser.json';
import { getDiasRestantes } from '../../shared/utils/getDiasRestantes';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid, LineChart, Line } from 'recharts';
import { Link } from 'react-router-dom';
import { useState } from 'react';
  // Datos simulados para el grafico de meta de ahorro
  const ahorroHistorico = [
    { fecha: '01/07', cantidad: 200 },
    { fecha: '15/07', cantidad: 400 },
    { fecha: '01/08', cantidad: 600 },
    { fecha: '15/08', cantidad: 900 },
    { fecha: '01/09', cantidad: 1200 },
  ];

export default function Dashboard() {
  const diasRestantes = getDiasRestantes(mockUser.ahorro.fechaLimite);
  const [mesSeleccionado, setMesSeleccionado] = useState(() => {
    const hoy = new Date();
    return hoy.toISOString().slice(0, 7);
  });
  const tieneIngresoFijo = mockUser.ingreso.tipo === 'fijo';
  const ingresoTotal = tieneIngresoFijo
    ? (mockUser.ingreso.montoTotal ?? 0)
    : mockUser.ingreso.montoTotal;
  const gastoFijoTotal = mockUser.gastosFijos.reduce((acc, g) => acc + g.monto, 0);
  const ahorro = mockUser.ahorro.acumulado;
  const sobranteParaGastar = ingresoTotal - gastoFijoTotal - ahorro;

  // Datos simulados para el grafico
  const estadisticasMensuales = [
    { mes: 'Jul', ingreso: 1200, gasto: 800 },
    { mes: 'Ago', ingreso: 1500, gasto: 950 },
    { mes: 'Sep', ingreso: 1100, gasto: 700 },
  ];

  return (
    <main className=" text-black bg-gray-50 p-6">
      <header>
        <section className="flex items-center gap-3 mb-2">
          <img src="/calendario.png" alt="Calendario" className="w-20 h-20" />
          <h1 className="text-3xl font-bold text-black">Resumen Financiero</h1>
        </section>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">Bienvenida, {mockUser.nombre}</h2>
            <div className="flex items-center gap-2">
              <input
                type="month"
                className="border px-2 py-1 rounded text-sm"
                aria-label="Seleccionar mes y año"
                value={mesSeleccionado}
                onChange={e => setMesSeleccionado(e.target.value)}
              />
              <button
                type="button"
                className="bg-gray-800 text-white px-3 py-1 rounded hover:bg-green-800 text-sm flex items-center gap-1"
                aria-label="Buscar"
                onClick={() => {}}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                Buscar
              </button>
            </div>
          
          </div>
        </div>
        <section className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
          
          {tieneIngresoFijo ? (
            <span className="text-base text-green-950 flex items-center gap-2">Ingreso fijo: <span className="font-bold">${mockUser.ingreso.montoTotal}</span>
              <button type="button" className="p-1 rounded-full hover:bg-yellow-200" aria-label="Editar ingreso fijo">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
              </button>
            </span>
          ) : (
            <div className="w-full flex justify-between">
              <span className="text-base text-green-950 flex items-center gap-2">Total ingresos variables: <span className="font-bold">${mockUser.ingreso.montoTotal}</span>
                <button type="button" className="ml-2 bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 text-sm" aria-label="Agregar ingreso variable">
                  + Agregar
                </button>
              </span>
              <Link
                to="/ingresos-variables"
                className=" items-center  bg-white text-gray-800 px-4 py-2 rounded-lg shadow transition-all duration-200 hover:shadow-2xl hover:-translate-y-1 cursor-pointer text-sm"
                aria-label="Ir a ingresos variables"
              >
                Ver todos los ingresos variables
              </Link>
            </div>
          )}
          <button
            type="button"
            className="ml-8 flex items-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-lg shadow transition-all duration-200 hover:shadow-2xl hover:-translate-y-1 cursor-pointer text-sm"
            aria-label="Agregar ingreso extra"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-banknote-arrow-up-icon lucide-banknote-arrow-up">
              <path d="M12 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5"/>
              <path d="M18 12h.01"/>
              <path d="M19 22v-6"/>
              <path d="m22 19-3-3-3 3"/>
              <path d="M6 12h.01"/>
              <circle cx="12" cy="12" r="2"/>
            </svg>
            <span>Agregar ingreso extra</span>
          </button>
          <button
            type="button"
            className="ml-2 flex items-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-lg shadow transition-all duration-200 hover:shadow-2xl hover:-translate-y-1 cursor-pointer text-sm"
            aria-label="Agregar sobrante"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-badge-dollar-sign-icon lucide-badge-dollar-sign">
              <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/>
              <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
              <path d="M12 18V6"/>
            </svg>
            <span>Agregar sobrante</span>
          </button>
        </section>
      </header>
   
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8" aria-label="Resumen de totales">
          <div className="bg-white p-4 rounded shadow transition-all duration-200 hover:shadow-2xl hover:-translate-y-1 cursor-pointer flex items-center gap-4 justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-2">Ingreso Total</h2>
              <div className="text-2xl text-green-600">${ingresoTotal}</div>
            </div>  
            
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sigma-icon lucide-sigma">
              <path d="M18 7V5a1 1 0 0 0-1-1H6.5a.5.5 0 0 0-.4.8l4.5 6a2 2 0 0 1 0 2.4l-4.5 6a.5.5 0 0 0 .4.8H17a1 1 0 0 0 1-1v-2"/>
            </svg>
          </div>
          <div className="bg-white p-4 rounded shadow transition-all duration-200 hover:shadow-2xl hover:-translate-y-1 cursor-pointer flex items-center gap-4 justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-2">Gasto Fijo Total</h2>
              <div className="text-2xl text-gray-400">${gastoFijoTotal}</div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-house-plus-icon lucide-house-plus">
              <path d="M12.662 21H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v2.475"/>
              <path d="M14.959 12.717A1 1 0 0 0 14 12h-4a1 1 0 0 0-1 1v8"/>
              <path d="M15 18h6"/>
              <path d="M18 15v6"/>
            </svg>
          </div>
          <div className="bg-white p-4 rounded shadow transition-all duration-200 hover:shadow-2xl hover:-translate-y-1 cursor-pointer flex items-center gap-4 justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-2">Ahorro</h2>
              <div className="text-2xl text-blue-600">${ahorro}</div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calculator-icon lucide-calculator">
              <rect width="16" height="20" x="4" y="2" rx="2"/>
              <line x1="8" x2="16" y1="6" y2="6"/>
              <line x1="16" x2="16" y1="14" y2="18"/>
              <path d="M16 10h.01"/>
              <path d="M12 10h.01"/>
              <path d="M8 10h.01"/>
              <path d="M12 14h.01"/>
              <path d="M8 14h.01"/>
              <path d="M12 18h.01"/>
              <path d="M8 18h.01"/>
            </svg>
          </div>
          <div className="bg-white p-4 rounded shadow transition-all duration-200 hover:shadow-2xl hover:-translate-y-1 cursor-pointer flex items-center gap-4 justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-2">Sobrante para Gastar</h2>
              <div className="text-2xl text-yellow-600">${sobranteParaGastar}</div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check-icon lucide-circle-check">
              <circle cx="12" cy="12" r="10"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
          </div>
          <div className="bg-white p-4 rounded shadow flex-col  not-first:gap-4 transition-all duration-200 hover:shadow-2xl hover:-translate-y-1 cursor-pointer">

            <div>
              <h2 className="text-lg font-semibold text-center  mb-2">Cuenta regresiva</h2>
               <div className='flex justify-center mb-2'><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alarm-clock-icon lucide-alarm-clock">
              <circle cx="12" cy="13" r="8"/>
              <path d="M12 9v4l2 2"/>
              <path d="M5 3 2 6"/>
              <path d="m22 6-3-3"/>
              <path d="M6.38 18.7 4 21"/>
              <path d="M17.64 18.67 20 21"/>
            </svg></div>
              <div className="text-2xl text-center  text-red-600">{diasRestantes} días</div>
              <p className="text-xs text-gray-500 text-center ">para la meta de ahorro</p>
            </div>
          </div>
        </section>
      <section className="bg-white p-6 rounded shadow mb-6" aria-labelledby="detalle-ingresos-gastos">
        <h2 id="detalle-ingresos-gastos" className="text-xl font-semibold mb-4">Detalle de Ingresos y Gastos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold mb-2">Estadísticas mensuales</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={estadisticasMensuales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="ingreso" fill="#38bdf8" name="Ingresos" />
                <Bar dataKey="gasto" fill="#f87171" name="Gastos" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
      <section className="bg-white p-6 rounded shadow" aria-labelledby="meta-ahorro">
        <h2 id="meta-ahorro" className="text-xl font-semibold mb-4">Meta de Ahorro</h2>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <h3 className="font-bold mb-2">Evolución del ahorro</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={ahorroHistorico}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cantidad" stroke="#22c55e" name="Ahorro acumulado" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </main>
  );
}
