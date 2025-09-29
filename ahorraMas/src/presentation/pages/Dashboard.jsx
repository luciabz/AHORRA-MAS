
import { getDiasRestantes } from '../../domain/services/getDiasRestantes';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isTokenExpired, scheduleTokenLogout } from '../../domain/services/session';
import ResumenTotales from '../components/dashboard/ResumenTotales';
import Navbar from '../components/Navbar';
import SelectorMesBusqueda from '../components/dashboard/SelectorMesBusqueda';
import DetalleIngresosGastos from '../components/dashboard/DetalleIngresosGastos';
import MetaAhorro from '../components/dashboard/MetaAhorro';
import { UserApi } from '../../infrastructure/api/userApi';


  // Simulado, reemplazar por datos reales si es necesario
  const ahorroHistorico = [
    { fecha: '01/07', cantidad: 200 },
    { fecha: '15/07', cantidad: 400 },
    { fecha: '01/08', cantidad: 600 },
    { fecha: '15/08', cantidad: 900 },
    { fecha: '01/09', cantidad: 1200 },
  ];


export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [mesSeleccionado, setMesSeleccionado] = useState(() => {
    const hoy = new Date();
    return hoy.toISOString().slice(0, 7);
  });
  // Simulados, reemplazar por datos reales si se conectan endpoints
  const [ingresoTotal] = useState(1200);
  const [gastoFijoTotal] = useState(800);
  const [ahorro] = useState(200);
  const [sobranteParaGastar] = useState(200);
  const [diasRestantes] = useState(10);
  const [tieneIngresoVariable] = useState(true);
  const estadisticasMensuales = [
    { mes: 'Jul', ingreso: 1200, gasto: 800 },
    { mes: 'Ago', ingreso: 1500, gasto: 950 },
    { mes: 'Sep', ingreso: 1100, gasto: 700 },
  ];

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }
    UserApi.me(token)
      .then(data => setUser(data))
      .catch(() => setUser(null));
    const timeout = scheduleTokenLogout(token, () => {
      localStorage.removeItem('token');
      navigate('/login');
    });
    return () => timeout && clearTimeout(timeout);
  }, [navigate]);
  const goToVariableIncome = () => {
    navigate('/ingresos-variables');
  };


  return (
    <>
      <Navbar />

      <main className="text-black bg-gray-50 p-2 sm:p-4 md:p-6">
        <header>
          <section className="flex flex-col sm:flex-row items-center gap-3 mb-2">
            <img src="/calendario.png" alt="Calendario" className="w-16 h-16 sm:w-20 sm:h-20" />
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Resumen Financiero</h1>
          </section>
          <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-4 mb-4">
            <div className="flex gap-4 flex-col md:flex-row items-center">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">Bienvenido, {user ? user.name : '...'}</h2>
              <SelectorMesBusqueda mesSeleccionado={mesSeleccionado} setMesSeleccionado={setMesSeleccionado} />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 mb-6">
            <span className="text-base text-green-950 flex items-center gap-2">Ingreso total: <span className="font-bold">${ingresoTotal}</span>
              <button type="button" className="p-1 rounded-full hover:bg-yellow-200" aria-label="Editar ingreso total">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
              </button>
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full">
            <button
              type="button"
              className="flex-1 flex items-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-lg shadow transition-all duration-200 hover:shadow-2xl hover:-translate-y-1 cursor-pointer text-sm justify-center"
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
              className="flex-1 flex items-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-lg shadow transition-all duration-200 hover:shadow-2xl hover:-translate-y-1 cursor-pointer text-sm justify-center"
              aria-label="Agregar sobrante"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-badge-dollar-sign-icon lucide-badge-dollar-sign">
                <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/>
                <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
                <path d="M12 18V6"/>
              </svg>
              <span>Agregar sobrante</span>
            </button>
            {tieneIngresoVariable && (
              <button
                type="button"
                className="flex-1 flex items-center gap-2 bg-blue-100 text-blue-900 px-4 py-2 rounded-lg shadow transition-all duration-200 hover:shadow-2xl hover:-translate-y-1 cursor-pointer text-sm border border-blue-300 justify-center"
                aria-label="Ir a ingresos variables"
                onClick={goToVariableIncome}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <span>agregar ingresos variables</span>
              </button>
            )}
          </div>
        </header>

        <ResumenTotales
          ingresoTotal={ingresoTotal}
          gastoFijoTotal={gastoFijoTotal}
          ahorro={ahorro}
          sobranteParaGastar={sobranteParaGastar}
          diasRestantes={diasRestantes}
        />

      <DetalleIngresosGastos estadisticasMensuales={estadisticasMensuales} />
      <MetaAhorro ahorroHistorico={ahorroHistorico} />
      </main>
    </>
  );
}
