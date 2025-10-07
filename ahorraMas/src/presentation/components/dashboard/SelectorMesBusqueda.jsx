export default function SelectorMesBusqueda({ mesSeleccionado, setMesSeleccionado }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="month"
        className="border px-2 py-1 rounded text-sm"
        aria-label="Seleccionar mes y año"
        value={mesSeleccionado}
        onChange={e => setMesSeleccionado(e.target.value)}
      />
     
    </div>
  );
}
