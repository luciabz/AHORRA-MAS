import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import './Auth.css';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  
  // Usar el contexto de autenticación
  const { register, loading } = useAuthContext();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const result = await register(form);
      
      if (result.success) {
        setSuccess('Usuario creado exitosamente');
        setTimeout(() => navigate('/login'), 1000);
      } else {
        setError(result.message || 'Error al registrar usuario');
      }
    } catch (err) {
      setError('Error de conexión. Intente nuevamente.');
    }
  };

  return (
    <main className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1 className="auth-title">Registro</h1>
        <input
          className="input"
          type="text"
          name="name"
          placeholder="Usuario"
          value={form.name}
          onChange={handleChange}
          required
        />
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
        {success && <div className="auth-success">{success}</div>}
        <button className="btn" type="submit">Registrarse</button>
        <p className="auth-link">¿Ya tienes cuenta? <span onClick={() => navigate('/login')}>Inicia sesión</span></p>
      </form>
    </main>
  );
}
