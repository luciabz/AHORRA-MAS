import '../src/index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CleanArchitectureProvider } from './presentation/context/CleanArchitectureContext';
import Navbar from './presentation/components/Navbar';
import Dashboard from './presentation/pages/Dashboard';
import SavingsGoal from './presentation/pages/SavingsGoal';
import FixedExpenses from './presentation/pages/FixedExpenses';
import VariableIncome from './presentation/pages/VariableIncome';
import TransactionList from './presentation/components/examples/TransactionList';

function App() {
  return (
    <CleanArchitectureProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/meta" element={<SavingsGoal />} />
          <Route path="/gastos" element={<FixedExpenses />} />
          <Route path="/ingresos-variables" element={<VariableIncome />} />
          <Route path="/transactions-example" element={<TransactionList />} />
        </Routes>
      </BrowserRouter>
    </CleanArchitectureProvider>
  );
}

export default App;
