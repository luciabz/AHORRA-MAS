import mockUser from '../../shared/constants/mockUser.json';
import { getDiasRestantes } from '../../shared/utils/getDiasRestantes';
import { useState } from 'react';
import ResumenTotales from '../components/dashboard/ResumenTotales';
import SelectorMesBusqueda from '../components/dashboard/SelectorMesBusqueda';
import DetalleIngresosGastos from '../components/dashboard/DetalleIngresosGastos';
import MetaAhorro from '../components/dashboard/MetaAhorro';

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
            <SelectorMesBusqueda mesSeleccionado={mesSeleccionado} setMesSeleccionado={setMesSeleccionado} />
          </div>
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
  );
}
