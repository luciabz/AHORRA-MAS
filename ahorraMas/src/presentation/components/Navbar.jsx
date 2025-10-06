import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    setOpen(false);
    
    navigate('/');
  };
  return (
    <nav className="bg-teal-900 px-4 py-3 shadow flex items-center justify-between relative" aria-label="Navegación principal">
      <div className="font-bold text-xl text-white">AHORRA-MÁS</div>
      {/* Botón hamburguesa mobile */}
      <button
        className="sm:hidden flex flex-col justify-center items-center w-10 h-10 text-white focus:outline-none"
        aria-label="Abrir menú"
        onClick={() => setOpen(!open)}
      >
        <span className={`block h-0.5 w-6 bg-white mb-1 transition-all duration-200 ${open ? 'rotate-45 translate-y-2' : ''}`}></span>
        <span className={`block h-0.5 w-6 bg-white mb-1 transition-all duration-200 ${open ? 'opacity-0' : ''}`}></span>
        <span className={`block h-0.5 w-6 bg-white transition-all duration-200 ${open ? '-rotate-45 -translate-y-2' : ''}`}></span>
      </button>
      {/* Menú horizontal desktop y menú mobile */}
      <ul
        className={`sm:flex space-x-0 sm:space-x-4 p-2 sm:p-0 flex-col sm:flex-row absolute sm:static top-full left-0 w-full sm:w-auto bg-teal-900 sm:bg-transparent z-20 transition-all duration-200 ${open ? 'flex' : 'hidden sm:flex'}`}
      >
        <li className="my-2 sm:my-0">
          <Link to="/dashboard" className="block !text-white font-bold hover:underline px-4 py-2" onClick={() => setOpen(false)}>Resumen</Link>
        </li>
        <li className="my-2 sm:my-0">
          <Link to="/transacciones" className="block !text-white font-bold hover:underline px-4 py-2" onClick={() => setOpen(false)}>Historial</Link>
        </li>
        <li className="my-2 sm:my-0">
          <Link to="/gastos" className="block !text-white font-bold hover:underline px-4 py-2" onClick={() => setOpen(false)}>Gastos Fijos</Link>
        </li>
        <li className="my-2 sm:my-0">
          <Link to="/meta" className="block !text-white font-bold hover:underline px-4 py-2" onClick={() => setOpen(false)}>Meta de Ahorro</Link>
        </li>
        <li className="my-2 sm:my-0">
          <button 
            onClick={handleLogout}
            className="block !text-white font-bold hover:underline px-4 py-2 text-left w-full"
          >
            Cerrar Sesión
          </button>
        </li>
      </ul>
    </nav>
  );
}
