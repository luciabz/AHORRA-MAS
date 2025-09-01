import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './presentation/components/Navbar';
import Dashboard from './presentation/pages/Dashboard';
import SavingsGoal from './presentation/pages/SavingsGoal';
import FixedExpenses from './presentation/pages/FixedExpenses';

function App() {
  return (
    <BrowserRouter>
       <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/meta-ahorro" element={<SavingsGoal />} />
        <Route path="/gastos-fijos" element={<FixedExpenses />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
