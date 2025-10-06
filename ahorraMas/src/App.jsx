import '../src/index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './presentation/contexts';
import AppRoutes from './routes/AppRoutes';
import ApiConfig from './presentation/components/ApiConfig';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ApiConfig>
          <AppRoutes />
        </ApiConfig>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
