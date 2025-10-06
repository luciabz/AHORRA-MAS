import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';


export default function Login() {
  const [form, setForm] = useState({ name: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  // Usar el contexto de autenticación
  const { login, loading } = useAuthContext();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    
    try {
      const result = await login(form);
      
      if (result.success) {
        console.log('Login exitoso:', result);
        navigate('/dashboard');
      } else {
        setError(result.message || 'Credenciales incorrectas');
      }
    } catch (err) {
      console.error('Error en login:', err);
      setError('Error de conexión. Intente nuevamente.');
    }
  };

  return (
    <main className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1 className="auth-title">Iniciar sesión</h1>
        <input
          className="input"
          type="text"
          name="name"
          placeholder="Nombre de usuario"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          className="input"
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
        />
        {error && <div className="auth-error">{error}</div>}
        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Iniciando sesión...' : 'Entrar'}
        </button>
        <p className="auth-link">¿No tienes cuenta? <span onClick={() => navigate('/register')}>Regístrate</span></p>
      </form>
    </main>
  );
}
