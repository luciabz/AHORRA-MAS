import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Welcome from '../presentation/pages/Welcome';
import Login from '../presentation/pages/Login';
import Register from '../presentation/pages/Register';
import Dashboard from '../presentation/pages/Dashboard';
import PrivateRoute from './PrivateRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />
    </Routes>
  );
}
