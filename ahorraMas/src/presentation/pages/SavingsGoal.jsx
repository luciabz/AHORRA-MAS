import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useGoals } from '../hooks/useGoals';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function SavingsGoal() {
  const { 
    goals, 
    loading, 
    error: goalError, 
    addGoal, 
    editGoal, 
    removeGoal,
    getGoalDetails 
  } = useGoals();
  
  const [form, setForm] = useState({ title: '', description: '', targetAmount: '', deadline: '' });
  const [success, setSuccess] = useState('');
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorGoalId, setCalculatorGoalId] = useState(null);
  const [calculatorMode, setCalculatorMode] = useState('time');
  const [calculatorValue, setCalculatorValue] = useState('');

  // Funciones de cálculo
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  // Crear meta
  const handleSubmit = async e => {
    e.preventDefault();
    setSuccess('');
    try {
      const result = await addGoal(form);
      
      if (result && result.success) {
        setForm({ title: '', description: '', targetAmount: '', deadline: '' });
        setSuccess('Meta creada exitosamente');
        MySwal.fire({ icon: 'success', title: 'Meta creada', text: 'La meta fue creada exitosamente.' });
      } else {
        MySwal.fire({ icon: 'error', title: 'Error', text: result?.message || 'No se pudo crear la meta.' });
      }
    } catch (err) {
      MySwal.fire({ icon: 'error', title: 'Error', text: 'No se pudo crear la meta: ' + err.message });
    }
  };

  // Eliminar meta con confirmación
  const handleDelete = async id => {
    const result = await MySwal.fire({
      title: '¿Eliminar meta?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (result.isConfirmed) {
      try {
        const result = await removeGoal(id);
        if (result && result.success) {
          MySwal.fire('Eliminada', 'La meta fue eliminada.', 'success');
        } else {
          MySwal.fire('Error', result?.message || 'No se pudo eliminar la meta.', 'error');
        }
      } catch (err) {
        MySwal.fire('Error', 'No se pudo eliminar la meta: ' + err.message, 'error');
      }
    }
  };

  // Mostrar detalle en modal
  const handleShowDetail = async id => {
    try {
      const result = await getGoalDetails(id);
      const data = result.success ? result.data : result;
      MySwal.fire({
        title: <span>Detalle de la meta</span>,
        html: (
          <div className="text-left">
            <div><b>Título:</b> {data.title}</div>
            <div><b>Descripción:</b> {data.description}</div>
            <div><b>Monto objetivo:</b> ${data.targetAmount}</div>
            <div><b>Fecha límite:</b> {data.deadline?.slice(0,10)}</div>
            <div><b>Estado:</b> {data.state}</div>
            <div><b>Creado:</b> {data.created_at ? data.created_at.slice(0,10) : '-'}</div>
            <div><b>Actualizado:</b> {data.updated_at ? data.updated_at.slice(0,10) : '-'}</div>
          </div>
        ),
        showCloseButton: true,
        showConfirmButton: false,
        width: 400,
      });
    } catch {
      MySwal.fire('Error', 'No se pudo cargar el detalle.', 'error');
    }
  };

  // Editar meta (abrir modal)
  const handleEdit = goal => {
    MySwal.fire({
      title: 'Editar meta',
      html: (
        <div className="flex flex-col gap-2">
          <input
            id="swal-input1"
            className="swal2-input"
            placeholder="Descripción"
            defaultValue={goal.description}
          />
          <input
            id="swal-input2"
            className="swal2-input"
            type="number"
            placeholder="Monto objetivo"
            defaultValue={goal.targetAmount}
          />
        </div>
      ),
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const description = document.getElementById('swal-input1').value;
        const targetAmount = document.getElementById('swal-input2').value;
        if (!description || !targetAmount) {
          Swal.showValidationMessage('Todos los campos son obligatorios');
        }
        return { description, targetAmount };
      }
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          const updateResult = await editGoal(goal.id, result.value);
          if (updateResult && updateResult.success) {
            MySwal.fire('Actualizada', 'La meta fue actualizada.', 'success');
          } else {
            MySwal.fire('Error', updateResult?.message || 'No se pudo actualizar la meta.', 'error');
          }
        } catch (err) {
          MySwal.fire('Error', 'No se pudo actualizar la meta: ' + err.message, 'error');
        }
      }
    });
  };

  return (
    <>
      <Navbar />
      <main className="text-black bg-gray-50 p-6">
      <header>
        <h1 className="text-3xl font-bold mb-6">Metas de Ahorro</h1>
      </header>

      {/* Calculator Section */}
      <section className="bg-gradient-to-r from-purple-50 to-orange-50 p-6 rounded shadow mb-6" aria-labelledby="calculadora-meta">
        <h2 id="calculadora-meta" className="text-xl font-semibold mb-4">🧮 Calculadora de Metas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Modo Tiempo */}
          <div className="bg-white p-4 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-purple-600 mb-3">⏱️ Calcular Tiempo</h3>
            <div className="space-y-2">
              <input
                type="number"
                placeholder="Monto objetivo"
                step="0.01"
                min="0"
                id="calc-target"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
              <input
                type="number"
                placeholder="Inversión mensual"
                step="0.01"
                min="0"
                id="calc-monthly"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
              <button
                onClick={() => {
                  const target = parseFloat(document.getElementById('calc-target').value);
                  const monthly = parseFloat(document.getElementById('calc-monthly').value);
                  if (target && monthly && monthly > 0) {
                    const months = calculateTimeNeeded(target, 0, monthly);
                    MySwal.fire({
                      title: '⏱️ Resultado',
                      html: `<p>Necesitarás <strong>${months} meses</strong> para alcanzar <strong>$${target}</strong></p>`,
                      icon: 'info'
                    });
                  } else {
                    MySwal.fire('Error', 'Por favor completa los campos correctamente', 'error');
                  }
                }}
                className="w-full bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded text-sm"
              >
                Calcular
              </button>
            </div>
          </div>

          {/* Modo Inversión */}
          <div className="bg-white p-4 rounded-lg border border-orange-200">
            <h3 className="font-semibold text-orange-600 mb-3">📊 Calcular Inversión</h3>
            <div className="space-y-2">
              <input
                type="number"
                placeholder="Monto objetivo"
                step="0.01"
                min="0"
                id="calc-target-inv"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              />
              <input
                type="number"
                placeholder="Meses disponibles"
                step="1"
                min="1"
                id="calc-months"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              />
              <button
                onClick={() => {
                  const target = parseFloat(document.getElementById('calc-target-inv').value);
                  const months = parseInt(document.getElementById('calc-months').value);
                  if (target && months && months > 0) {
                    const monthly = calculateMonthlyInvestment(target, 0, months);
                    MySwal.fire({
                      title: '📊 Resultado',
                      html: `<p>Debes invertir <strong>$${monthly}</strong> mensualmente para alcanzar <strong>$${target}</strong> en <strong>${months} meses</strong></p>`,
                      icon: 'info'
                    });
                  } else {
                    MySwal.fire('Error', 'Por favor completa los campos correctamente', 'error');
                  }
                }}
                className="w-full bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded text-sm"
              >
                Calcular
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white p-6 rounded shadow mb-6" aria-labelledby="definir-meta">
        <h2 id="definir-meta" className="text-xl font-semibold mb-4">Definir Meta de Ahorro</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title" className="block text-gray-700 mb-2">Título</label>
            <input id="title" name="title" type="text" className="w-full px-3 py-2 border rounded" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <label htmlFor="description" className="block text-gray-700 mb-2">Descripción</label>
            <input id="description" name="description" type="text" className="w-full px-3 py-2 border rounded" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
          </div>
          <div>
            <label htmlFor="targetAmount" className="block text-gray-700 mb-2">Monto objetivo</label>
            <input id="targetAmount" name="targetAmount" type="number" className="w-full px-3 py-2 border rounded" value={form.targetAmount} onChange={e => setForm({ ...form, targetAmount: e.target.value })} required />
          </div>
          <div>
            <label htmlFor="deadline" className="block text-gray-700 mb-2">Fecha límite</label>
            <input id="deadline" name="deadline" type="date" className="w-full px-3 py-2 border rounded" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} required />
          </div>
          <div className="md:col-span-2 flex justify-end mt-4">
            <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800">Guardar Meta</button>
          </div>
        </form>
        {goalError && <div className="text-red-600 mt-2">{goalError}</div>}
        {success && <div className="text-green-700 mt-2">{success}</div>}
      </section>
      <section className="bg-white p-6 rounded shadow" aria-labelledby="estado-meta">
        <h2 id="estado-meta" className="text-xl font-semibold mb-4">Tus Metas</h2>
        {loading ? (
          <div>Cargando...</div>
        ) : goals.length === 0 ? (
          <div className="text-gray-500">No tienes metas creadas.</div>
        ) : (
          <ul className="space-y-4">
            {goals.map(goal => (
              <li key={goal.id} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <div className="font-bold text-lg">{goal.title}</div>
                  <div className="text-gray-700">{goal.description}</div>
                  <div className="text-gray-700">Monto objetivo: ${goal.targetAmount}</div>
                  <div className="text-gray-700">Fecha límite: {goal.deadline?.slice(0,10)}</div>
                  <div className="text-gray-700">Estado: {goal.state}</div>
                </div>
                <div className="flex gap-2 items-center">
                  <button onClick={() => handleShowDetail(goal.id)} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Ver detalle</button>
                  <button onClick={() => handleEdit(goal)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Editar</button>
                  <button onClick={() => handleDelete(goal.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
      </main>
    </>
  );
}
