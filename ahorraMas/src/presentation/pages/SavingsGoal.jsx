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

  // Crear meta
  const handleSubmit = async e => {
    e.preventDefault();
    setSuccess('');
    try {
      console.log('🎯 SavingsGoal: Creando meta con datos:', form);
      const result = await addGoal(form);
      console.log('🎯 SavingsGoal: Resultado de addGoal:', result);
      
      if (result && result.success) {
        setForm({ title: '', description: '', targetAmount: '', deadline: '' });
        setSuccess('Meta creada exitosamente');
        MySwal.fire({ icon: 'success', title: 'Meta creada', text: 'La meta fue creada exitosamente.' });
      } else {
        console.error('❌ SavingsGoal: Error en resultado:', result);
        MySwal.fire({ icon: 'error', title: 'Error', text: result?.message || 'No se pudo crear la meta.' });
      }
    } catch (err) {
      console.error('❌ SavingsGoal: Excepción:', err);
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
