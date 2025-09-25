import React, { useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { isTokenExpired, scheduleTokenLogout } from '../domain/services/session';

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }
    const timeout = scheduleTokenLogout(token, () => {
      localStorage.removeItem('token');
      navigate('/login');
    });
    return () => timeout && clearTimeout(timeout);
  }, [token, navigate]);

  if (!token || isTokenExpired(token))
    return <Navigate to="/login" replace />;
  return children;
}

