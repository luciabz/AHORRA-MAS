import '../src/index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './presentation/components/Navbar';
import Dashboard from './presentation/pages/Dashboard';
import SavingsGoal from './presentation/pages/SavingsGoal';
import FixedExpenses from './presentation/pages/FixedExpenses';
import VariableIncome from './presentation/pages/VariableIncome';

function App() {
  return (
    <BrowserRouter>
       <Navbar />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/meta" element={<SavingsGoal />} />
        <Route path="/gastos" element={<FixedExpenses />} />
        <Route path="/ingresos-variables" element={<VariableIncome />} />

        
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
