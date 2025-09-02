export default function FormGastoFijo({ onSubmit }) {
  return (
    <form className="flex gap-4" onSubmit={onSubmit}>
  <input type="text"  placeholder="Nombre" />
  <input type="number" placeholder="Monto" />
  <input type="submit" value="Guardar" />
    </form>
  );
}
