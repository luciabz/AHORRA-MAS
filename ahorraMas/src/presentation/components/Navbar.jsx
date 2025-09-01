import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
  <nav className="bg-teal-900 px-4 py-3 shadow flex items-center justify-between" aria-label="Navegación principal">
      <div className="font-bold text-xl text-white">AHORRA-MÁS</div>
      <ul className="flex space-x-4 p-2">
        <li>
          <Link to="/" className="!text-white font-bold hover:underline">Resumen</Link>
        </li>
        <li>
          <Link to="/gastos-fijos" className="!text-white font-bold hover:underline">Gastos Fijos</Link>
        </li>
       
        <li>
          <Link to="/meta-ahorro" className="!text-white font-bold hover:underline">Meta de Ahorro</Link>
        </li>
        <li>
          <Link to="/" className="!text-white font-bold hover:underline">Salir</Link>
        </li>
      </ul>
    </nav>
  );
}
