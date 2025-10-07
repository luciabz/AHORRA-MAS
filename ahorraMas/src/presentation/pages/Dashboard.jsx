
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ResumenTotales from '../components/dashboard/ResumenTotales';
import Navbar from '../components/Navbar';
import SelectorMesBusqueda from '../components/dashboard/SelectorMesBusqueda';
import DetalleIngresosGastos from '../components/dashboard/DetalleIngresosGastos';
import MetaAhorro from '../components/dashboard/MetaAhorro';
import { useTransactions, useCategories, useGoals, useScheduledTransactions } from '../hooks';
import { useAuthContext } from '../contexts';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

import Swal from 'sweetalert2';


  const ahorroHistorico = [
    { fecha: '01/07', cantidad: 200 },
    { fecha: '15/07', cantidad: 400 },
    { fecha: '01/08', cantidad: 600 },
    { fecha: '15/08', cantidad: 900 },
    { fecha: '01/09', cantidad: 1200 },
  ];


export default function Dashboard() {
  const navigate = useNavigate();
  
  const { user, isAuthenticated, loading: authLoading } = useAuthContext();
  const { 
    transactions, 
    loading: transLoading, 
    error: transError,
    addTransaction,
    getTransactionsByMonth,
    getTransactionsByType,
    getTotals 
  } = useTransactions();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { goals, loading: goalsLoading } = useGoals();
  const { 
    scheduledTransactions, 
    loading: scheduleLoading,
    getUpcomingTransactions 
  } = useScheduledTransactions();
  
  const loading = authLoading || transLoading || scheduleLoading || categoriesLoading || goalsLoading;
  const error = transError || categoriesError;
  
  const [showSobranteModal, setShowSobranteModal] = useState(false);
  const [mesSeleccionado, setMesSeleccionado] = useState(() => {
    const hoy = new Date();
    return hoy.toISOString().slice(0, 7);
  });
  
  

  const [year, month] = mesSeleccionado.split('-').map(Number);
  
  
  
  const calcularTotales = (transacciones) => {
    let totalIngresos = 0;
    let totalGastos = 0;
    let gastosFijos = 0;
    let gastosVariables = 0;
    
    transacciones.forEach(t => {
      const amount = parseFloat(t.amount) || 0;
      if (t.type === 'income') {
        totalIngresos += amount;
      } else if (t.type === 'expense') {
        totalGastos += amount;
        if (t.regularity === 'fixed' || t.regularity === 'static') {
          gastosFijos += amount;
        } else {
          gastosVariables += amount;
        }
      }
    });
    
    return {
      income: totalIngresos,
      expense: totalGastos,
      balance: totalIngresos - totalGastos, 
      fixedExpenses: gastosFijos,
      variableExpenses: gastosVariables
    };
  };
  
  const filtrarTransaccionesPorMes = (transacciones, mes, año) => {
    return transacciones.filter(t => {
      const fecha = new Date(t.date || t.nextOccurrence || t.createdAt);
      return fecha.getMonth() === mes && fecha.getFullYear() === año;
    });
  };
  
  const todasLasTransacciones = [...transactions, ...scheduledTransactions];
  
 
  const transaccionesMes = getTransactionsByMonth(month - 1, year); // Solo transacciones regulares
  const transaccionesProgramadasMes = filtrarTransaccionesPorMes(scheduledTransactions, month - 1, year);
  
  const transaccionesMesCompletas = [...transaccionesMes, ...transaccionesProgramadasMes];
  
  const transaccionesParaCalcular = transaccionesMesCompletas.length > 0 ? transaccionesMesCompletas : todasLasTransacciones;
  const totalesCalculados = calcularTotales(transaccionesParaCalcular);
  
  const ingresoTotal = totalesCalculados.income;
  const gastoTotal = totalesCalculados.expense; 
  const gastoFijoTotal = totalesCalculados.fixedExpenses;
  const gastoVariableTotal = totalesCalculados.variableExpenses;
  
  const balanceReal = ingresoTotal - gastoTotal;
  
  
  const ahorro = balanceReal > 0 ? balanceReal * 0.2 : 0;
  const sobranteParaGastar = balanceReal > 0 ? balanceReal - ahorro : 0;
  
  const ingresosVariables = todasLasTransacciones.filter(t => 
    t.type === 'income' && (t.regularity === 'variable' || !t.regularity)
  );
  
  // Calcular días restantes para la meta más próxima
  const calcularDiasParaMeta = () => {
    // Filtrar metas activas (que no están completadas y tienen fecha límite)
    const metasActivas = goals.filter(goal => 
      (goal.deadline || goal.endDate) && 
      new Date(goal.deadline || goal.endDate) > new Date() &&
      parseFloat(goal.currentAmount || 0) < parseFloat(goal.targetAmount)
    );


    if (metasActivas.length === 0) {
      // Si no hay metas activas, usar días restantes del mes como fallback
      const hoy = new Date();
      const ultimoDiaDelMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
      return Math.max(0, ultimoDiaDelMes.getDate() - hoy.getDate());
    }

    // Encontrar la meta más próxima a vencer
    const metaMasProxima = metasActivas.sort((a, b) => 
      new Date(a.deadline || a.endDate) - new Date(b.deadline || b.endDate)
    )[0];


    // Calcular días restantes para esa meta
    const hoy = new Date();
    const fechaMeta = new Date(metaMasProxima.deadline || metaMasProxima.endDate);
    const diferencia = fechaMeta - hoy;
    const diasRestantes = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
    
    
    return Math.max(0, diasRestantes);
  };

  const diasRestantes = calcularDiasParaMeta();
  
  const handleAssignAhorroToGoal = async () => {
    const metasActivas = goals.filter(goal => 
      (goal.deadline || goal.endDate) && 
      new Date(goal.deadline || goal.endDate) > new Date() &&
      parseFloat(goal.currentAmount || 0) < parseFloat(goal.targetAmount)
    );

    if (metasActivas.length === 0) {
      Swal.fire({
        title: 'No hay metas activas',
        text: 'Crea una meta primero para asignar tu ahorro',
        icon: 'info',
        confirmButtonColor: '#2563eb'
      });
      return;
    }

    if (ahorro <= 0) {
      Swal.fire({
        title: 'No hay ahorro disponible',
        text: 'No tienes ahorro disponible para asignar a una meta',
        icon: 'warning',
        confirmButtonColor: '#dc2626'
      });
      return;
    }

    // Crear opciones para el select
    const opcionesMetas = metasActivas.map(meta => 
      `<option value="${meta.id}">${meta.title} (${formatCurrency(parseFloat(meta.currentAmount || 0))} / ${formatCurrency(parseFloat(meta.targetAmount))})</option>`
    ).join('');

    const { value: formValues } = await Swal.fire({
      title: 'Asignar Ahorro a Meta',
      html: `
        <div class="space-y-4">
          <div class="text-sm text-blue-600 bg-blue-50 p-3 rounded">
            <strong>💰 Ahorro disponible:</strong> ${formatCurrency(ahorro)}
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Selecciona la meta:</label>
            <select id="swal-meta" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Seleccione una meta</option>
              ${opcionesMetas}
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Monto a asignar:</label>
            <input id="swal-monto" type="number" step="0.01" min="0.01" max="${ahorro}" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0.00" value="${ahorro}" />
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Asignar Ahorro',
      cancelButtonText: 'Cancelar',
      focusConfirm: false,
      width: '500px',
      preConfirm: () => {
        const metaId = document.getElementById('swal-meta').value;
        const monto = document.getElementById('swal-monto').value;
        
        if (!metaId || !monto) {
          Swal.showValidationMessage('Por favor completa todos los campos');
          return false;
        }
        
        if (parseFloat(monto) <= 0 || parseFloat(monto) > ahorro) {
          Swal.showValidationMessage(`El monto debe estar entre 0.01 y ${ahorro}`);
          return false;
        }
        
        return { 
          metaId: parseInt(metaId), 
          monto: parseFloat(monto)
        };
      }
    });

    if (formValues) {
      try {
        const meta = metasActivas.find(m => m.id === formValues.metaId);
        const nuevoMonto = parseFloat(meta.currentAmount || 0) + formValues.monto;
        
        // Simular actualización de meta (aquí deberías usar tu API)
          metaId: formValues.metaId,
          nuevoMonto: nuevoMonto,
          montoAsignado: formValues.monto
        });

        Swal.fire({
          title: '¡Ahorro asignado!',
          text: `Has asignado $${formValues.monto.toFixed(2)} a la meta "${meta.title}"`,
          icon: 'success',
          confirmButtonColor: '#16a34a'
        });

        // Aquí podrías recargar los datos o actualizar el estado
        
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo asignar el ahorro a la meta',
          icon: 'error',
          confirmButtonColor: '#dc2626'
        });
      }
    }
  };

  // Helper para formatear moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };
  
  const tieneIngresoVariable = ingresosVariables.length > 0;
  const ingresosConCategorias = ingresosVariables.map(ingreso => ({
    ...ingreso,
    categoryName: categories.find(cat => cat.id === ingreso.categoryId)?.name || 'Sin categoría'
  }));
  
  const estadisticasMensuales = [
    {
      mes: mesSeleccionado.slice(5, 7), 
      ingreso: totalesCalculados.income,
      gasto: totalesCalculados.expense,
      balance: totalesCalculados.balance
    }
  ];

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="text-black bg-gray-50 p-2 sm:p-4 md:p-6">
          <LoadingState 
            title="Cargando dashboard..."
            description="Estamos obteniendo tus datos financieros"
            size="large"
          />
        </main>
      </>
    );
  }

  if (error && transactions.length === 0 && categories.length === 0) {
    return (
      <>
        <Navbar />
        <main className="text-black bg-gray-50 p-2 sm:p-4 md:p-6">
          <ErrorState 
            title="Error de conexión"
            description="No se pueden cargar los datos. Verifica que la API esté ejecutándose."
            error={error}
            onRetry={() => window.location.reload()}
          />
        </main>
      </>
    );
  }




  const goToVariableIncome = () => {
    navigate('/ingresos-variables');
  };

  const handleIngresosVariables = async () => {
  


    const totalIngresosVariables = ingresosConCategorias.reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const listaIngresos = ingresosConCategorias.length > 0 
      ? ingresosConCategorias.map(ingreso => `
          <div class="flex justify-between items-center p-2 bg-gray-50 rounded mb-2">
            <div>
              <div class="font-medium">${ingreso.description}</div>
              <div class="text-sm text-gray-600">${ingreso.categoryName}</div>
            </div>
            <div class="font-bold text-green-600">+$${parseFloat(ingreso.amount).toFixed(2)}</div>
          </div>
        `).join('')
      : '<div class="text-gray-500 text-center py-4">No hay ingresos variables este mes</div>';

    const { value: action } = await Swal.fire({
      title: 'Ingresos Variables del Mes',
      html: `
        <div class="space-y-4">
          <div class="text-sm text-gray-600 bg-blue-50 p-3 rounded">
            <strong>Total ingresos variables:</strong> $${totalIngresosVariables.toFixed(2)}
          </div>
          <div class="max-h-60 overflow-y-auto">
            ${listaIngresos}
          </div>
        </div>
      `,
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonColor: '#16a34a',
      denyButtonColor: '#2563eb',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Agregar Nuevo',
      denyButtonText: 'Ver Todos',
      cancelButtonText: 'Cerrar',
      focusConfirm: false,
      width: '600px'
    });

    if (action === true) {
      await mostrarFormularioIngresoVariable();
    } else if (action === false) {
      navigate('/ingresos-variables');
    }
  };

  const mostrarFormularioIngresoVariable = async () => {
    // Buscar categorías de ingreso
    const categoriasIngreso = categories.filter(cat => 
      cat.name.toLowerCase().includes('ingreso') || 
      cat.name.toLowerCase().includes('income') ||
      cat.name.toLowerCase().includes('salario') ||
      cat.name.toLowerCase().includes('freelance') ||
      cat.name.toLowerCase().includes('extra')
    );

    const { value: formValues } = await Swal.fire({
      title: 'Agregar Ingreso Variable',
      html: `
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Descripción:</label>
            <input id="swal-descripcion" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Ej: Freelance, comisión, bono..." />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Monto:</label>
            <input id="swal-monto" type="number" step="0.01" min="0" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="0.00" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Categoría:</label>
            <select id="swal-categoria" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="">Seleccione una categoría</option>
              ${categories.map(cat => 
                `<option value="${cat.id}" ${categoriasIngreso.includes(cat) ? 'selected' : ''}>${cat.name}</option>`
              ).join('')}
            </select>
          </div>
          <div class="text-sm text-green-600 bg-green-50 p-3 rounded">
            <strong>💡 Tip:</strong> Los ingresos variables son aquellos que no son fijos cada mes (freelance, comisiones, bonos, etc.)
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Guardar Ingreso',
      cancelButtonText: 'Cancelar',
      focusConfirm: false,
      width: '500px',
      preConfirm: () => {
        const descripcion = document.getElementById('swal-descripcion').value;
        const monto = document.getElementById('swal-monto').value;
        const categoria = document.getElementById('swal-categoria').value;
        
        if (!descripcion || !monto || !categoria) {
          Swal.showValidationMessage('Por favor completa todos los campos');
          return false;
        }
        
        if (parseFloat(monto) <= 0) {
          Swal.showValidationMessage('El monto debe ser mayor a 0');
          return false;
        }
        
        return { 
          description: descripcion, 
          amount: parseFloat(monto), 
          categoryId: parseInt(categoria) 
        };
      }
    });

    if (formValues) {
      try {
        const newTransaction = {
          ...formValues,
          type: 'income',
          regularity: 'variable',
          date: new Date().toISOString()
        };

        const result = await addTransaction(newTransaction);
        
        if (!result.success) {
          throw new Error(result.message);
        }
        
        Swal.fire({
          title: '¡Ingreso variable agregado!',
          text: `Has agregado $${formValues.amount.toFixed(2)} como ingreso variable`,
          icon: 'success',
          confirmButtonColor: '#16a34a'
        });

      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo guardar el ingreso variable. Intenta nuevamente.',
          icon: 'error',
          confirmButtonColor: '#dc2626'
        });
      }
    }
  };

  const handleAgregarSobrante = async () => {
    const categoriaAhorro = categories.find(cat => 
      cat.name.toLowerCase().includes('ahorro') || 
      cat.name.toLowerCase().includes('saving')
    );

    const { value: formValues } = await Swal.fire({
      title: 'Agregar Sobrante del Mes Anterior',
      html: `
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Descripción:</label>
            <input id="swal-descripcion" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" value="Sobrante del mes anterior" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Monto del sobrante:</label>
            <input id="swal-monto" type="number" step="0.01" min="0" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" value="" placeholder="Ingrese el monto del sobrante" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Categoría:</label>
            <select id="swal-categoria" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
              ${categories.map(cat => 
                `<option value="${cat.id}" ${cat.name.toLowerCase().includes('ingreso') || cat.name.toLowerCase().includes('income') || cat.name.toLowerCase().includes('sobrante') ? 'selected' : ''}>${cat.name}</option>`
              ).join('')}
            </select>
          </div>
          <div class="text-sm text-blue-600 bg-blue-50 p-3 rounded">
            <strong>📝 Nota:</strong> Este sobrante se agregará como ingreso al mes actual para aumentar tu dinero disponible.
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Agregar Sobrante',
      cancelButtonText: 'Cancelar',
      focusConfirm: false,
      width: '500px',
      preConfirm: () => {
        const descripcion = document.getElementById('swal-descripcion').value;
        const monto = document.getElementById('swal-monto').value;
        const categoria = document.getElementById('swal-categoria').value;
        
        if (!descripcion || !monto || !categoria) {
          Swal.showValidationMessage('Por favor completa todos los campos');
          return false;
        }
        
        if (parseFloat(monto) <= 0) {
          Swal.showValidationMessage('El monto debe ser mayor a 0');
          return false;
        }
        
        return { 
          description: descripcion, 
          amount: parseFloat(monto), 
          categoryId: parseInt(categoria) 
        };
      }
    });

    if (formValues) {
      try {
        const newTransaction = {
          ...formValues,
          type: 'income', 
          regularity: 'extra', 
          date: new Date().toISOString()
        };

        const result = await addTransaction(newTransaction);
       
        
        if (!result || !result.success) {
          throw new Error(result?.message || 'Error desconocido al guardar');
        }
        
        Swal.fire({
          title: '¡Sobrante agregado!',
          text: `Has agregado $${formValues.amount.toFixed(2)} como ingreso del mes anterior`,
          icon: 'success',
          confirmButtonColor: '#16a34a'
        });

      } catch (error) {
       
        
        const errorMessage = error.message || error.response?.data?.message || 'Error desconocido';
        
        Swal.fire({
          title: 'Error',
          text: `No se pudo guardar el sobrante: ${errorMessage}`,
          icon: 'error',
          confirmButtonColor: '#dc2626'
        });
      }
    }
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
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">
                Bienvenido, {loading ? '...' : (user ? user.name : '...')}
              </h2>
              <SelectorMesBusqueda mesSeleccionado={mesSeleccionado} setMesSeleccionado={setMesSeleccionado} />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 mb-6">
            <span className="text-base text-green-950 flex items-center gap-2">
              Ingreso total: <span className="font-bold">${loading ? '...' : ingresoTotal.toFixed(2)}</span>
             
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full">
            <button
              type="button"
              className="flex-1 flex items-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-lg shadow transition-all duration-200 hover:shadow-2xl hover:-translate-y-1 cursor-pointer text-sm justify-center"
              aria-label="Agregar ingreso extra"
              onClick={() => navigate('/transacciones')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-banknote-arrow-up-icon lucide-banknote-arrow-up">
                <path d="M12 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5"/>
                <path d="M18 12h.01"/>
                <path d="M19 22v-6"/>
                <path d="m22 19-3-3-3 3"/>
                <path d="M6 12h.01"/>
                <circle cx="12" cy="12" r="2"/>
              </svg>
              <span>Gestionar transacciones</span>
            </button>
            <button
              type="button"
              className="flex-1 flex items-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-lg shadow transition-all duration-200 hover:shadow-2xl hover:-translate-y-1 cursor-pointer text-sm justify-center"
              aria-label="Agregar sobrante del mes anterior"
              onClick={handleAgregarSobrante}
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
                aria-label="Gestionar ingresos variables"
                onClick={handleIngresosVariables}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <span>Ingresos variables</span>
              </button>
            )}
          </div>
        </header>

        <ResumenTotales
          ingresoTotal={ingresoTotal}
          gastoTotal={gastoTotal}
          gastoFijoTotal={gastoFijoTotal}
          ahorro={ahorro}
          sobranteParaGastar={sobranteParaGastar}
          diasRestantes={diasRestantes}
          goals={goals}
          mesSeleccionado={mesSeleccionado}
          onAssignToGoal={handleAssignAhorroToGoal}
        />

      <DetalleIngresosGastos estadisticasMensuales={estadisticasMensuales} />
      <MetaAhorro ahorroHistorico={ahorroHistorico} goals={goals} />
      </main>
    </>
  );
}
