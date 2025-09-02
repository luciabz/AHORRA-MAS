export default function SelectorMesBusqueda({ mesSeleccionado, setMesSeleccionado }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="month"
        aria-label="Seleccionar mes y año"
        value={mesSeleccionado}
        onChange={e => setMesSeleccionado(e.target.value)}
      />
      <button
        type="button"
        className="bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700 text-sm flex items-center gap-1"
        aria-label="Buscar"
        onClick={() => {}}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        Buscar
      </button>
    </div>
  );
}
