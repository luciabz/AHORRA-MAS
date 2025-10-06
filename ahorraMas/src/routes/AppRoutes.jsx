import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Welcome from '../presentation/pages/Welcome';
import Login from '../presentation/pages/Login';
import Register from '../presentation/pages/Register';
import Dashboard from '../presentation/pages/Dashboard';
import PrivateRoute from './PrivateRoute';
import Gastos from '../presentation/pages/FixedExpenses';
import SavingsGoal from '../presentation/pages/SavingsGoal';
import VariableIncome from '../presentation/pages/VariableIncome';
import Transactions from '../presentation/pages/Transactions';
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
      <Route path="/gastos" element={
  <PrivateRoute>
    <Gastos />
  </PrivateRoute>
} />
<Route path="/meta" element={
  <PrivateRoute>
    <SavingsGoal />
  </PrivateRoute>
} />

<Route path="/ingresos-variables" element={
  <PrivateRoute>
    <VariableIncome />
  </PrivateRoute>
} />

<Route path="/transacciones" element={
  <PrivateRoute>
    <Transactions />
  </PrivateRoute>
} />

    </Routes>
  );
}
