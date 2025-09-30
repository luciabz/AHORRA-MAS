
import { getDiasRestantes } from '../../domain/services/getDiasRestantes';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isTokenExpired, scheduleTokenLogout } from '../../domain/services/session';
import ResumenTotales from '../components/dashboard/ResumenTotales';
import Navbar from '../components/Navbar';
import SelectorMesBusqueda from '../components/dashboard/SelectorMesBusqueda';
import DetalleIngresosGastos from '../components/dashboard/DetalleIngresosGastos';
import MetaAhorro from '../components/dashboard/MetaAhorro';
import { UserApi } from '../../infrastructure/api/userApi';
import { TransactionApi } from '../../infrastructure/api/transactionApi';
import { ScheduleTransactionApi } from '../../infrastructure/api/scheduleTransactionApi';
import { CategoryApi } from '../../infrastructure/api/categoryApi';
import Swal from 'sweetalert2';


  const ahorroHistorico = [
    { fecha: '01/07', cantidad: 200 },
    { fecha: '15/07', cantidad: 400 },
    { fecha: '01/08', cantidad: 600 },
    { fecha: '15/08', cantidad: 900 },
    { fecha: '01/09', cantidad: 1200 },
  ];


export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [scheduleTransactions, setScheduleTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSobranteModal, setShowSobranteModal] = useState(false);
  const [mesSeleccionado, setMesSeleccionado] = useState(() => {
    const hoy = new Date();
    return hoy.toISOString().slice(0, 7);
  });
  
  // Calcular totales basados en transacciones reales y programadas
  const ingresos = transactions.filter(t => t.type === 'income');
  const egresos = transactions.filter(t => t.type === 'expense');
  const ingresosProgram = scheduleTransactions.filter(t => t.type === 'income' && t.status);
  const egresosProgram = scheduleTransactions.filter(t => t.type === 'expense' && t.status);
  
  const ingresoTotal = ingresos.reduce((sum, t) => sum + parseFloat(t.amount), 0) + 
                      ingresosProgram.reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const gastoFijoTotal = egresos.filter(t => t.regularity === 'static').reduce((sum, t) => sum + parseFloat(t.amount), 0) +
                        egresosProgram.filter(t => t.regularity === 'static').reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const gastoVariableTotal = egresos.filter(t => t.regularity === 'variable').reduce((sum, t) => sum + parseFloat(t.amount), 0) +
                            egresosProgram.filter(t => t.regularity === 'variable').reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const ahorro = 200; // Este valor puede venir de otra API o cálculo
  const sobranteParaGastar = ingresoTotal - gastoFijoTotal - gastoVariableTotal - ahorro;
  const diasRestantes = 10; // Calcular según fecha actual
  const tieneIngresoVariable = [...ingresos, ...ingresosProgram].some(t => t.regularity === 'variable');
  // Calcular estadísticas mensuales basadas en transacciones reales y programadas
  const calcularEstadisticasMensuales = () => {
    const meses = {};
    
    // Procesar transacciones históricas
    transactions.forEach(transaction => {
      const fecha = new Date(transaction.createdAt);
      const mesKey = fecha.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
      
      if (!meses[mesKey]) {
        meses[mesKey] = { mes: mesKey, ingreso: 0, gasto: 0 };
      }
      
      if (transaction.type === 'income') {
        meses[mesKey].ingreso += parseFloat(transaction.amount);
      } else if (transaction.type === 'expense') {
        meses[mesKey].gasto += parseFloat(transaction.amount);
      }
    });
    
    // Añadir transacciones programadas para el mes actual
    const mesActual = new Date().toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
    if (!meses[mesActual]) {
      meses[mesActual] = { mes: mesActual, ingreso: 0, gasto: 0 };
    }
    
    scheduleTransactions.forEach(schedule => {
      if (schedule.status) {
        if (schedule.type === 'income') {
          meses[mesActual].ingreso += parseFloat(schedule.amount);
        } else if (schedule.type === 'expense') {
          meses[mesActual].gasto += parseFloat(schedule.amount);
        }
      }
    });
    
    return Object.values(meses).slice(-3); // Últimos 3 meses
  };
  
  const estadisticasMensuales = calcularEstadisticasMensuales();

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }
    
    // Cargar datos del usuario, transacciones, transacciones programadas y categorías
    const loadData = async () => {
      try {
        setLoading(true);
        const [userData, transactionData, scheduleData, categoryData] = await Promise.all([
          UserApi.me(token),
          TransactionApi.list(token),
          ScheduleTransactionApi.list(token),
          CategoryApi.list(token)
        ]);
        setUser(userData);
        setTransactions(transactionData);
        setScheduleTransactions(scheduleData);
        setCategories(categoryData);
      } catch (error) {
        console.error('Error loading data:', error);
        setUser(null);
        setTransactions([]);
        setScheduleTransactions([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
    
    const timeout = scheduleTokenLogout(token, () => {
      localStorage.removeItem('token');
      navigate('/login');
    });
    return () => timeout && clearTimeout(timeout);
  }, [navigate]);
  const goToVariableIncome = () => {
    navigate('/ingresos-variables');
  };

  const handleIngresosVariables = async () => {
    // Filtrar ingresos variables del mes actual (solo los que tienen regularity: 'variable')
    const mesActual = new Date().getMonth();
    const añoActual = new Date().getFullYear();
    
    const ingresosVariablesDelMes = transactions.filter(transaction => {
      const fechaTransaccion = new Date(transaction.createdAt);
      return transaction.type === 'income' && 
             transaction.regularity === 'variable' &&
             fechaTransaccion.getMonth() === mesActual &&
             fechaTransaccion.getFullYear() === añoActual;
    });

    console.log('Ingresos variables encontrados:', ingresosVariablesDelMes);

    const totalIngresosVariables = ingresosVariablesDelMes.reduce((sum, t) => sum + parseFloat(t.amount), 0);

    // Mapear ingresos con nombres de categorías
    const ingresosConCategorias = ingresosVariablesDelMes.map(ingreso => {
      const categoria = categories.find(cat => cat.id === ingreso.categoryId);
      return {
        ...ingreso,
        categoryName: categoria ? categoria.name : 'Sin categoría'
      };
    });

    // Crear lista HTML de ingresos variables
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
      // Agregar nuevo ingreso variable
      await mostrarFormularioIngresoVariable();
    } else if (action === false) {
      // Ir a la página de ingresos variables
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
        const token = localStorage.getItem('token');
        
        const newTransaction = {
          ...formValues,
          type: 'income',
          regularity: 'variable'
        };

        await TransactionApi.create(newTransaction, token);
        
        Swal.fire({
          title: '¡Ingreso variable agregado!',
          text: `Has agregado $${formValues.amount.toFixed(2)} como ingreso variable`,
          icon: 'success',
          confirmButtonColor: '#16a34a'
        });

        // Recargar los datos para actualizar el dashboard
        const [updatedTransactions, updatedScheduleData] = await Promise.all([
          TransactionApi.list(token),
          ScheduleTransactionApi.list(token)
        ]);
        setTransactions(updatedTransactions);
        setScheduleTransactions(updatedScheduleData);

      } catch (error) {
        console.error('Error al guardar ingreso variable:', error);
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
    // Buscar categoría de ahorro
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
        const token = localStorage.getItem('token');
        
        const newTransaction = {
          ...formValues,
          type: 'income', // Se registra como ingreso porque es dinero que entra del mes anterior
          regularity: 'extra' // Es un ingreso extra del sobrante
        };

        await TransactionApi.create(newTransaction, token);
        
        Swal.fire({
          title: '¡Sobrante agregado!',
          text: `Has agregado $${formValues.amount.toFixed(2)} como ingreso del mes anterior`,
          icon: 'success',
          confirmButtonColor: '#16a34a'
        });

        // Recargar los datos para actualizar el dashboard
        const [updatedTransactions, updatedScheduleData] = await Promise.all([
          TransactionApi.list(token),
          ScheduleTransactionApi.list(token)
        ]);
        setTransactions(updatedTransactions);
        setScheduleTransactions(updatedScheduleData);

      } catch (error) {
        console.error('Error al guardar ahorro:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo guardar el ahorro. Intenta nuevamente.',
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
              <button type="button" className="p-1 rounded-full hover:bg-yellow-200" aria-label="Editar ingreso total">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
              </button>
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
          gastoFijoTotal={gastoFijoTotal}
          ahorro={ahorro}
          sobranteParaGastar={sobranteParaGastar}
          diasRestantes={diasRestantes}
        />

      <DetalleIngresosGastos estadisticasMensuales={estadisticasMensuales} />
      <MetaAhorro ahorroHistorico={ahorroHistorico} />
      </main>
    </>
  );
}
