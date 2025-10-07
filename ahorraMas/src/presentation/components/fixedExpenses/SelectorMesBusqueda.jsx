export default function SelectorMesBusqueda({ mesSeleccionado, setMesSeleccionado }) {
  const handleClearFilter = () => {
    setMesSeleccionado('');
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
      <input
        id="mes-selector"
        type="month"
        aria-label="Seleccionar mes y año"
        value={mesSeleccionado}
        onChange={e => setMesSeleccionado(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
      />
      {mesSeleccionado && (
        <button
          type="button"
          className="bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700 text-sm flex items-center justify-center gap-2 transition-colors"
          aria-label="Limpiar filtro"
          onClick={handleClearFilter}
          title="Limpiar filtro de mes"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="hidden sm:inline">Limpiar</span>
        </button>
      )}
    </div>
  );
}
