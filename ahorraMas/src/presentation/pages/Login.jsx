import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await axios.post(`${apiUrl}/api/v1/auth/login/`, form);
      
      // Guardar token
      localStorage.setItem('token', res.data.token);
      
      // Si la respuesta incluye información del usuario, guardarla
      if (res.data.user && res.data.user.id) {
        localStorage.setItem('userId', res.data.user.id.toString());
      }
      
      console.log('Login exitoso:', res.data);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error en login:', err);
      setError(err.response?.data?.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1 className="auth-title">Iniciar sesión</h1>
        <input
          className="input"
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
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
