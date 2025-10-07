export default function ResumenTotales({ ingresoTotal, gastoTotal, gastoFijoTotal, ahorro, sobranteParaGastar, diasRestantes, goals, mesSeleccionado, onAssignToGoal }) {
  // Calcular días restantes en tiempo real (independiente del mes seleccionado)
  const calcularDiasRestantesReal = (goal) => {
    const hoy = new Date();
    const fechaMeta = new Date(goal.deadline || goal.endDate);
    const diferencia = fechaMeta - hoy;
    const diasRestantes = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
    return Math.max(0, diasRestantes);
  };

  const getNextGoal = () => {
    if (!goals || goals.length === 0) return null;
    
    const activeGoals = goals.filter(goal => 
      (goal.deadline || goal.endDate) && 
      new Date(goal.deadline || goal.endDate) > new Date() &&
      parseFloat(goal.currentAmount || 0) < parseFloat(goal.targetAmount)
    );

    if (activeGoals.length === 0) return null;

    return activeGoals.sort((a, b) => 
      new Date(a.deadline || a.endDate) - new Date(b.deadline || b.endDate)
    )[0];
  };

  const nextGoal = getNextGoal();
  const diasRestantesReal = nextGoal ? calcularDiasRestantesReal(nextGoal) : diasRestantes;
  return (
    <>
  
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
      <div className="bg-white p-4 rounded shadow flex-col transition-all duration-200 hover:shadow-2xl hover:-translate-y-1 cursor-pointer">
        <div>
          <h2 className="text-lg font-semibold text-center mb-2">Cuenta regresiva</h2>
          <div className='flex justify-center mb-2'>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alarm-clock-icon lucide-alarm-clock">
              <circle cx="12" cy="13" r="8"/>
              <path d="M12 9v4l2 2"/>
              <path d="M5 3 2 6"/>
              <path d="m22 6-3-3"/>
              <path d="M6.38 18.7 4 21"/>
              <path d="M17.64 18.67 20 21"/>
            </svg>
          </div>
          
          {nextGoal ? (
            <>
              <div className={`text-2xl text-center font-bold ${diasRestantesReal <= 7 ? 'text-red-600' : diasRestantesReal <= 30 ? 'text-yellow-600' : 'text-green-600'}`}>
                {diasRestantesReal} días
              </div>
              <p className="text-xs text-gray-500 text-center mb-2">
                para: {nextGoal.title}
              </p>
              <div className="text-xs text-center">
                <div className="bg-gray-100 rounded-full h-2 mb-1">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((parseFloat(nextGoal.currentAmount || 0) / parseFloat(nextGoal.targetAmount)) * 100, 100)}%` }}
                  ></div>
                </div>
                <span className="text-gray-600">
                  ${parseFloat(nextGoal.currentAmount || 0).toLocaleString()} / ${parseFloat(nextGoal.targetAmount).toLocaleString()}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="text-xl text-center text-gray-400 mb-2">
                🎯
              </div>
              <p className="text-xs text-gray-500 text-center">
                No hay metas activas
              </p>
            </>
          )}
        </div>
      </div>
    </section>
    </>
  );
}
