import React, { useEffect, useState } from 'react';
import { GoalApi } from '../../infrastructure/api/goalApi';
import Navbar from '../components/Navbar';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function SavingsGoal() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', description: '', targetAmount: '', deadline: '' });
  const [success, setSuccess] = useState('');
  const [showDetailId, setShowDetailId] = useState(null);
  const [detailGoal, setDetailGoal] = useState(null);
  const [editGoalId, setEditGoalId] = useState(null);
  const [editForm, setEditForm] = useState({ description: '', targetAmount: '' });

  const token = localStorage.getItem('token');

  // Listar metas al montar
  useEffect(() => {
    const fetchGoals = async () => {
      setLoading(true);
      try {
        const data = await GoalApi.list(token);
        setGoals(data);
      } catch (err) {
        setError('Error al cargar metas');
      } finally {
        setLoading(false);
      }
    };
    fetchGoals();
  }, [token]);

  // Crear meta
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const newGoal = await GoalApi.create(form, token);
      setGoals([...goals, newGoal]);
      setForm({ title: '', description: '', targetAmount: '', deadline: '' });
      setSuccess('Meta creada exitosamente');
      MySwal.fire({ icon: 'success', title: 'Meta creada', text: 'La meta fue creada exitosamente.' });
    } catch (err) {
      setError('Error al crear meta');
      MySwal.fire({ icon: 'error', title: 'Error', text: 'No se pudo crear la meta.' });
    }
  };

  // Eliminar meta con confirmación
  const handleDelete = async id => {
    setError('');
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
        await GoalApi.remove(id, token);
        setGoals(goals.filter(g => g.id !== id));
        MySwal.fire('Eliminada', 'La meta fue eliminada.', 'success');
      } catch {
        setError('Error al eliminar meta');
        MySwal.fire('Error', 'No se pudo eliminar la meta.', 'error');
      }
    }
  };

  // Mostrar detalle en modal
  const handleShowDetail = async id => {
    setShowDetailId(id);
    setDetailGoal(null);
    try {
      const data = await GoalApi.detail(id, token);
      setDetailGoal(data);
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
    setEditGoalId(goal.id);
    setEditForm({ description: goal.description, targetAmount: goal.targetAmount });
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
          const updated = await GoalApi.update(goal.id, result.value, token);
          setGoals(goals.map(g => g.id === goal.id ? { ...g, ...updated } : g));
          MySwal.fire('Actualizada', 'La meta fue actualizada.', 'success');
        } catch {
          MySwal.fire('Error', 'No se pudo actualizar la meta.', 'error');
        }
      }
      setEditGoalId(null);
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
        {error && <div className="text-red-600 mt-2">{error}</div>}
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
