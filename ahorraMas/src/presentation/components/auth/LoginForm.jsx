import React, { useState } from 'react';
import { useAuthContext } from '../../contexts';

/**
 * Componente de Login usando el hook useAuth
 */
const LoginForm = () => {
  const { login, register, loading, user, isAuthenticated } = useAuthContext();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let result;
      
      if (isLoginMode) {
        result = await login({
          email: formData.email,
          password: formData.password
        });
      } else {
        result = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
      }

      if (result.success) {
        alert(result.message || `${isLoginMode ? 'Login' : 'Registro'} exitoso`);
        // Aquí podrías redirigir al dashboard
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Si ya está autenticado, mostrar información del usuario
  if (isAuthenticated()) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-green-600">¡Bienvenido!</h2>
        <div className="space-y-2">
          <p><strong>Nombre:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
        </div>
        <button
          onClick={() => window.location.href = '/dashboard'}
          className="w-full mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Ir al Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {isLoginMode ? 'Iniciar Sesión' : 'Registrarse'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLoginMode && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={!isLoginMode}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading 
            ? (isLoginMode ? 'Iniciando sesión...' : 'Registrando...') 
            : (isLoginMode ? 'Iniciar Sesión' : 'Registrarse')
          }
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => {
            setIsLoginMode(!isLoginMode);
            setFormData({ name: '', email: '', password: '' });
          }}
          className="text-blue-500 hover:text-blue-700 text-sm"
        >
          {isLoginMode 
            ? '¿No tienes cuenta? Regístrate' 
            : '¿Ya tienes cuenta? Inicia sesión'
          }
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
