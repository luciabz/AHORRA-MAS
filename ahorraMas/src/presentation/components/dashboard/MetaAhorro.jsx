import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function MetaAhorro({ ahorroHistorico }) {
  return (
    <section className="bg-white p-6 rounded shadow" aria-labelledby="meta-ahorro">
      <h2 id="meta-ahorro" className="text-xl font-semibold mb-4">Meta de Ahorro</h2>
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <h3 className="font-bold mb-2">Evolución del ahorro</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={ahorroHistorico}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="cantidad" stroke="#22c55e" name="Ahorro acumulado" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
