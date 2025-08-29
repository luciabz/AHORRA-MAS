import { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './presentation/components/Navbar';
import Login from './presentation/pages/Login';
import Register from './presentation/pages/Register';
import Dashboard from './presentation/pages/Dashboard';
import Transactions from './presentation/pages/Transactions';
import SavingsGoal from './presentation/pages/SavingsGoal';

function App() {
  return (
    <BrowserRouter>
      {window.location.pathname !== '/' && window.location.pathname !== '/register' && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/transacciones" element={<Transactions />} />
        <Route path="/meta-ahorro" element={<SavingsGoal />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
