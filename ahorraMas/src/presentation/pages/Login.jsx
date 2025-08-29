export default function Login() {
  return (
    <main className="w-screen h-screen text-black flex items-center justify-center bg-gray-100">
      <section className="bg-white p-8 rounded shadow-md w-full max-w-md" aria-labelledby="login-title">
        <header>
          <h2 id="login-title" className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
        </header>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
            <input id="email" name="email" type="email" className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-2">Contraseña</label>
            <input id="password" name="password" type="password" className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Ingresar</button>
        </form>
        <div className="mt-4 text-center">
          <a href="#" className="text-blue-600 hover:underline">¿No tienes cuenta? Regístrate</a>
        </div>
      </section>
    </main>
  );
}
