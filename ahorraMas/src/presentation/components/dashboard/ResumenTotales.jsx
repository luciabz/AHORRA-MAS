export default function ResumenTotales({ ingresoTotal, gastoFijoTotal, ahorro, sobranteParaGastar, diasRestantes }) {
  return (
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
  );
}
