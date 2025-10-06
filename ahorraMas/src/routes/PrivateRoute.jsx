import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../presentation/contexts';

export default function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

