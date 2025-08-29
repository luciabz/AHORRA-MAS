// Dashboard.jsx
import React from 'react';

export default function Dashboard() {
  return (
    <main className="min-h-screen w-screen text-black bg-gray-50 p-6">
      <header>
        <h1 className="text-3xl font-bold text-black mb-6">Resumen Financiero</h1>
      </header>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" aria-label="Resumen de totales">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Ingreso Total</h2>
          <div className="text-2xl font-bold text-green-600">$0</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Gasto Fijo Total</h2>
          <div className="text-2xl font-bold text-red-600">$0</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Ahorro</h2>
          <div className="text-2xl font-bold text-blue-600">$0</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Sobrante para Gastar</h2>
          <div className="text-2xl font-bold text-yellow-600">$0</div>
        </div>
      </section>
      <section className="bg-white p-6 rounded shadow mb-6" aria-labelledby="detalle-ingresos-gastos">
        <h2 id="detalle-ingresos-gastos" className="text-xl font-semibold mb-4">Detalle de Ingresos y Gastos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold mb-2">Ingresos</h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Ingreso fijo: $0</li>
              <li>Acumulado mes anterior: $0</li>
              <li>Ingresos extras: $0</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">Gastos Fijos</h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Gasto fijo 1: $0</li>
              <li>Gasto fijo 2: $0</li>
            </ul>
          </div>
        </div>
      </section>
      <section className="bg-white p-6 rounded shadow" aria-labelledby="meta-ahorro">
        <h2 id="meta-ahorro" className="text-xl font-semibold mb-4">Meta de Ahorro</h2>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <span className="block text-gray-700 mb-2">Meta: $0</span>
            <span className="block text-gray-700 mb-2">Fecha límite: --/--/----</span>
          </div>
          <div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Editar Meta</button>
          </div>
        </div>
      </section>
    </main>
  );
}
