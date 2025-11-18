import React, { useState } from 'react';
import { useGoals } from '../../hooks';


const GoalsManager = () => {
  const { 
    goals, 
    loading, 
    addGoal, 
    editGoal, 
    removeGoal, 
    addToGoal,
    calculateProgress 
  } = useGoals();

  const [showForm, setShowForm] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorGoalId, setCalculatorGoalId] = useState(null);
  const [calculatorMode, setCalculatorMode] = useState('time'); // 'time' o 'monthly'
  const [calculatorValue, setCalculatorValue] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    deadline: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const goalData = {
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: 0,
        deadline: formData.deadline || null
      };
      
      const result = await addGoal(goalData);

      if (result && result.success) {
        alert('Meta creada exitosamente');
        setFormData({
          title: '',
          description: '',
          targetAmount: '',
          deadline: ''
        });
        setShowForm(false);
      } else {
        alert('Error: No se pudo crear la meta.');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta meta?')) {
      try {
        const result = await removeGoal(id);
        if (result.success) {
          alert('Meta eliminada exitosamente');
        } else {
          alert(result.message);
        }
      } catch (error) {
        alert('Error: ' + error.message);
      }
    }
  };

  const handleAddProgress = async (goalId, currentAmount, targetAmount) => {
    const amount = prompt('¿Cuánto quieres agregar a esta meta?');
    if (amount && !isNaN(amount)) {
      try {
        const result = await addToGoal(goalId, parseFloat(amount));
        if (result.success) {
          alert('Progreso actualizado exitosamente');
        } else {
          alert(result.message);
        }
      } catch (error) {
        alert('Error: ' + error.message);
      }
    }
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const calculateTimeNeeded = (targetAmount, currentAmount, monthlyInvestment) => {
    if (monthlyInvestment <= 0) return null;
    const remaining = targetAmount - currentAmount;
    const monthsNeeded = Math.ceil(remaining / monthlyInvestment);
    return monthsNeeded > 0 ? monthsNeeded : 0;
  };

  const calculateMonthlyInvestment = (targetAmount, currentAmount, months) => {
    if (months <= 0) return null;
    const remaining = targetAmount - currentAmount;
    return (remaining / months).toFixed(2);
  };

  const openCalculator = (goalId, mode) => {
    setCalculatorGoalId(goalId);
    setCalculatorMode(mode);
    setCalculatorValue('');
    setShowCalculator(true);
  };

  const handleCalculatorSubmit = () => {
    if (!calculatorValue || isNaN(calculatorValue)) {
      alert('Por favor ingresa un valor válido');
      return;
    }
    // El modal mostrará los resultados
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p>Cargando metas...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Metas de Ahorro
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {showForm ? 'Cancelar' : 'Nueva Meta'}
        </button>
      </div>

      {/* Calculator Section */}
      <div className="bg-gradient-to-r from-purple-50 to-orange-50 p-6 rounded-lg border border-purple-200 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">🧮 Calculadora de Metas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Modo Tiempo */}
          <div className="bg-white p-4 rounded-lg border border-purple-100">
            <h3 className="font-semibold text-purple-600 mb-3">⏱️ Calcular Tiempo</h3>
            <div className="space-y-2">
              <input
                type="number"
                placeholder="Monto objetivo"
                step="0.01"
                min="0"
                id="calc-target"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
              <input
                type="number"
                placeholder="Inversión mensual"
                step="0.01"
                min="0"
                id="calc-monthly"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
              <button
                onClick={() => {
                  const target = parseFloat(document.getElementById('calc-target').value);
                  const monthly = parseFloat(document.getElementById('calc-monthly').value);
                  if (target && monthly && monthly > 0) {
                    const months = calculateTimeNeeded(target, 0, monthly);
                    alert(`Necesitarás ${months} meses para alcanzar $${target}`);
                  } else {
                    alert('Por favor completa los campos correctamente');
                  }
                }}
                className="w-full bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded text-sm"
              >
                Calcular
              </button>
            </div>
          </div>

          {/* Modo Inversión */}
          <div className="bg-white p-4 rounded-lg border border-orange-100">
            <h3 className="font-semibold text-orange-600 mb-3">📊 Calcular Inversión</h3>
            <div className="space-y-2">
              <input
                type="number"
                placeholder="Monto objetivo"
                step="0.01"
                min="0"
                id="calc-target-inv"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              />
              <input
                type="number"
                placeholder="Meses disponibles"
                step="1"
                min="1"
                id="calc-months"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              />
              <button
                onClick={() => {
                  const target = parseFloat(document.getElementById('calc-target-inv').value);
                  const months = parseInt(document.getElementById('calc-months').value);
                  if (target && months && months > 0) {
                    const monthly = calculateMonthlyInvestment(target, 0, months);
                    alert(`Debes invertir $${monthly} mensualmente para alcanzar $${target} en ${months} meses`);
                  } else {
                    alert('Por favor completa los campos correctamente');
                  }
                }}
                className="w-full bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded text-sm"
              >
                Calcular
              </button>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
          <h2 className="text-lg font-semibold mb-4">Nueva Meta de Ahorro</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Título
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Monto Objetivo
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.targetAmount}
                onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fecha Límite
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Crear Meta
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.length === 0 ? (
          <div className="col-span-full text-center p-8">
            <p className="text-gray-500">No hay metas registradas.</p>
            <p className="text-sm text-gray-400">Crea tu primera meta de ahorro.</p>
          </div>
        ) : (
          goals.map(goal => {
            const progress = calculateProgress(goal);
            const isCompleted = progress >= 100;
            const daysRemaining = goal.deadline ? Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : null;
            
            return (
              <div key={goal.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {goal.title}
                  </h3>
                  <button
                    onClick={() => handleDelete(goal.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Eliminar
                  </button>
                </div>

                {goal.description && (
                  <p className="text-gray-600 text-sm mb-4">
                    {goal.description}
                  </p>
                )}

                <div className="space-y-3">
                  {/* Progress bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progreso</span>
                      <span>{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="text-sm">
                    <p>
                      <span className="font-medium">Actual:</span> {formatCurrency(goal.currentAmount || 0)}
                    </p>
                    <p>
                      <span className="font-medium">Objetivo:</span> {formatCurrency(goal.targetAmount)}
                    </p>
                    <p>
                      <span className="font-medium">Restante:</span> {formatCurrency(goal.targetAmount - (goal.currentAmount || 0))}
                    </p>
                  </div>

                  {goal.deadline && (
                    <div className="text-sm">
                      <p>
                        <span className="font-medium">Fecha límite:</span> {formatDate(goal.deadline)}
                      </p>
                      {daysRemaining !== null && (
                        <p className={`${daysRemaining < 0 ? 'text-red-600' : daysRemaining < 30 ? 'text-yellow-600' : 'text-green-600'}`}>
                          {daysRemaining < 0 
                            ? `Vencida hace ${Math.abs(daysRemaining)} días`
                            : `${daysRemaining} días restantes`
                          }
                        </p>
                      )}
                    </div>
                  )}

                  {/* Action button */}
                  {!isCompleted && (
                    <button
                      onClick={() => handleAddProgress(goal.id, goal.currentAmount || 0, goal.targetAmount)}
                      className="w-full mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                    >
                      Agregar Progreso
                    </button>
                  )}

                  {isCompleted && (
                    <div className="w-full mt-3 bg-green-100 text-green-800 font-bold py-2 px-4 rounded text-sm text-center">
                      ¡Meta Completada! 🎉
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default GoalsManager;
