import { useState, useEffect } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useGoals } from '../../hooks';
import { useNavigate } from 'react-router-dom';

export default function MetaAhorro({ ahorroHistorico }) {
  const navigate = useNavigate();
  const { goals, loading: goalsLoading } = useGoals();
  const [countdown, setCountdown] = useState({});

  // Función para calcular la cuenta regresiva
  const calculateCountdown = (endDate) => {
    const now = new Date().getTime();
    const target = new Date(endDate).getTime();
    const difference = target - now;

    if (difference <= 0) {
      return { expired: true, message: 'Meta vencida' };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes, expired: false };
  };

  // Actualizar cuenta regresiva cada minuto
  useEffect(() => {
    const updateCountdown = () => {
      const newCountdown = {};
      goals.forEach(goal => {
        if (goal.deadline || goal.endDate) {
          newCountdown[goal.id] = calculateCountdown(goal.deadline || goal.endDate);
        }
      });
      setCountdown(newCountdown);
    };

    // Actualizar inmediatamente
    updateCountdown();

    // Actualizar cada minuto
    const interval = setInterval(updateCountdown, 60000);

    return () => clearInterval(interval);
  }, [goals]);

  // Obtener la meta más próxima a vencer
  const getNextGoal = () => {
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
  const nextGoalCountdown = nextGoal ? countdown[nextGoal.id] : null;

  // Calcular progreso de la meta
  const calculateProgress = (goal) => {
    if (!goal || !goal.targetAmount) return 0;
    const progress = (parseFloat(goal.currentAmount || 0) / parseFloat(goal.targetAmount)) * 100;
    return Math.min(progress, 100);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  return (
    <section className="bg-white p-4 sm:p-6 rounded shadow" aria-labelledby="meta-ahorro">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 id="meta-ahorro" className="text-lg sm:text-xl font-semibold">Metas de Ahorro</h2>
        <button
          onClick={() => navigate('/meta')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm transition-colors"
        >
          Gestionar Metas
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cuenta regresiva de la próxima meta */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-lg border border-blue-200">
          <h3 className="text-base sm:text-lg font-semibold mb-4 text-blue-800">
            📅 Próxima Meta
          </h3>
          
          {goalsLoading ? (
            <div className="text-center py-4">
              <p className="text-gray-600">Cargando metas...</p>
            </div>
          ) : nextGoal ? (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 text-sm sm:text-base">{nextGoal.title}</h4>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">{nextGoal.description}</p>
              </div>

              {/* Cuenta regresiva */}
              <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                <p className="text-xs sm:text-sm text-gray-600 mb-2">Tiempo restante:</p>
                {nextGoalCountdown && !nextGoalCountdown.expired ? (
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-blue-100 rounded p-2">
                      <div className="text-lg sm:text-xl font-bold text-blue-800">{nextGoalCountdown.days}</div>
                      <div className="text-xs text-blue-600">Días</div>
                    </div>
                    <div className="bg-blue-100 rounded p-2">
                      <div className="text-lg sm:text-xl font-bold text-blue-800">{nextGoalCountdown.hours}</div>
                      <div className="text-xs text-blue-600">Horas</div>
                    </div>
                    <div className="bg-blue-100 rounded p-2">
                      <div className="text-lg sm:text-xl font-bold text-blue-800">{nextGoalCountdown.minutes}</div>
                      <div className="text-xs text-blue-600">Min</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-red-600 font-medium text-sm">
                    ⚠️ Meta vencida
                  </div>
                )}
              </div>

              {/* Progreso */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progreso</span>
                  <span>{calculateProgress(nextGoal).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${calculateProgress(nextGoal)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-600">
                  {formatCurrency(nextGoal.currentAmount || 0)} de {formatCurrency(nextGoal.targetAmount)}
                </div>
              </div>

              <div className="text-xs text-gray-500">
                Fecha límite: {new Date(nextGoal.deadline || nextGoal.endDate).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="text-4xl mb-2">🎯</div>
              <p className="text-gray-600 text-sm mb-4">No hay metas activas</p>
              <button
                onClick={() => navigate('/meta')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm transition-colors"
              >
                Crear Meta
              </button>
            </div>
          )}
        </div>

        {/* Gráfico de evolución del ahorro */}
        <div className="bg-white">
          <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">
            📈 Evolución del Ahorro
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={ahorroHistorico}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="fecha" 
                tick={{ fontSize: 12 }}
                tickMargin={5}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickMargin={5}
              />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="cantidad" 
                stroke="#22c55e" 
                name="Ahorro acumulado" 
                strokeWidth={2} 
                dot={{ r: 3 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Resumen de todas las metas */}
      {goals.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-base font-semibold mb-4 text-gray-800">
            📊 Resumen de Metas ({goals.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.slice(0, 3).map(goal => (
              <div key={goal.id} className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium text-sm truncate">{goal.title}</h4>
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>{calculateProgress(goal).toFixed(0)}%</span>
                  <span>{formatCurrency(goal.targetAmount)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                  <div 
                    className="bg-green-500 h-1 rounded-full"
                    style={{ width: `${calculateProgress(goal)}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {goals.length > 3 && (
              <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-center">
                <button
                  onClick={() => navigate('/meta')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Ver {goals.length - 3} más →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
