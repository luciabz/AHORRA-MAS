import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


export default function Login() {
  const [form, setForm] = useState({ name: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
  const apiUrl = import.meta.env.VITE_API_URL;
  const res = await axios.post(`${apiUrl}/api/v1/auth/login/`, form);
      localStorage.setItem('token', res.data.token);
  navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciales incorrectas');
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
          placeholder="Usuario"
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
        <button className="btn" type="submit">Entrar</button>
        <p className="auth-link">¿No tienes cuenta? <span onClick={() => navigate('/register')}>Regístrate</span></p>
      </form>
    </main>
  );
}
