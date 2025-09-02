import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';

export default function DetalleIngresosGastos({ estadisticasMensuales }) {
  return (
    <section className="bg-white p-6 rounded shadow mb-6" aria-labelledby="detalle-ingresos-gastos">
      <h2 id="detalle-ingresos-gastos" className="text-xl font-semibold mb-4">Detalle de Ingresos y Gastos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-bold mb-2">Estadísticas mensuales</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={estadisticasMensuales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="ingreso" fill="#38bdf8" name="Ingresos" />
              <Bar dataKey="gasto" fill="#f87171" name="Gastos" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
