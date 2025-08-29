import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './presentation/components/Navbar';
import Login from './presentation/pages/Login';
import Register from './presentation/pages/Register';
import Dashboard from './presentation/pages/Dashboard';


import SavingsGoal from './presentation/pages/SavingsGoal';
import FixedExpenses from './presentation/pages/FixedExpenses';

function App() {
  return (
    <BrowserRouter>
      {window.location.pathname !== '/' && window.location.pathname !== '/register' && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Dashboard />} />
      
        <Route path="/meta-ahorro" element={<SavingsGoal />} />
        <Route path="/gastos-fijos" element={<FixedExpenses />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
