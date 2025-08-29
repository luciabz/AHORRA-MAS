// Register.jsx
import React from 'react';

export default function Register() {
  return (
    <main className="min-h-screen w-screen text-black flex items-center justify-center bg-gray-100">
      <section className="bg-white p-8 rounded shadow-md w-full max-w-md" aria-labelledby="register-title">
        <header>
          <h2 id="register-title" className="text-2xl font-bold mb-6 text-center">Registro de Usuario</h2>
        </header>
        <form>
          <div className="mb-4">
            <label htmlFor="nombre" className="block text-gray-700 mb-2">Nombre</label>
            <input id="nombre" name="nombre" type="text" className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
            <input id="email" name="email" type="email" className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-2">Contraseña</label>
            <input id="password" name="password" type="password" className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Registrarse</button>
        </form>
        <div className="mt-4 text-center">
          <a href="#" className="text-blue-600 hover:underline">¿Ya tienes cuenta? Inicia sesión</a>
        </div>
      </section>
    </main>
  );
}
