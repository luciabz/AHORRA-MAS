export default function ResumenTotales({ ingresoTotal, gastoTotal, gastoFijoTotal, ahorro, sobranteParaGastar, diasRestantes, goals, mesSeleccionado, onAssignToGoal }) {


 

  return (
    <>
  
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" aria-label="Resumen de totales">
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
          <h2 className="text-lg font-semibold mb-2">Gasto Total</h2>
          <div className="text-2xl text-red-600">${gastoTotal}</div>
          <div className="text-sm text-gray-500">Fijos: ${gastoFijoTotal}</div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-receipt-text">
          <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/>
          <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
          <path d="M12 17.5v-11"/>
        </svg>
      </div>
      <div 
        className="bg-white p-4 rounded shadow transition-all duration-200 hover:shadow-2xl hover:-translate-y-1 cursor-pointer flex items-center gap-4 justify-between"
        onClick={onAssignToGoal}
      >
        <div>
          <h2 className="text-lg font-semibold mb-2">Ahorro</h2>
          <div className="text-2xl text-blue-600">${ahorro.toFixed(2)}</div>
          {ahorro > 0 && (
            <div className="text-xs text-blue-500 mt-1">
              💡 Click para asignar a meta
            </div>
          )}
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
     
      
    </section>
    </>
  );
}
