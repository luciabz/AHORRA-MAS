import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import EmptyState from '../EmptyState';

export default function DetalleIngresosGastos({ estadisticasMensuales }) {
  // Validar que estadisticasMensuales sea un array
  const chartData = Array.isArray(estadisticasMensuales) ? estadisticasMensuales : [];
  
  // Si no hay datos, mostrar un mensaje
  if (chartData.length === 0) {
    return (
      <section className="bg-white p-6 rounded shadow mb-6" aria-labelledby="detalle-ingresos-gastos">
        <h2 id="detalle-ingresos-gastos" className="text-xl font-semibold mb-4">Detalle de Ingresos y Gastos</h2>
        <EmptyState
          title="No hay estadísticas disponibles"
          description="Los gráficos aparecerán aquí cuando tengas transacciones registradas."
          icon={
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
      </section>
    );
  }

  return (
    <section className="bg-white p-6 rounded shadow mb-6" aria-labelledby="detalle-ingresos-gastos">
      <h2 id="detalle-ingresos-gastos" className="text-xl font-semibold mb-4">Detalle de Ingresos y Gastos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-bold mb-2">Estadísticas mensuales</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  `$${parseFloat(value).toFixed(2)}`, 
                  name
                ]}
              />
              <Legend />
              <Bar dataKey="ingreso" fill="#38bdf8" name="Ingresos" />
              <Bar dataKey="gasto" fill="#f87171" name="Gastos" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Agregar información adicional */}
        <div>
          <h3 className="font-bold mb-2">Resumen del mes</h3>
          {chartData.map((data, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between">
                <span>Ingresos:</span>
                <span className="text-blue-500 font-semibold">${data.ingreso?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span>Gastos:</span>
                <span className="text-red-500 font-semibold">${data.gasto?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span>Balance:</span>
                <span className={`font-semibold ${(data.balance || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ${data.balance?.toFixed(2) || '0.00'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
