// MOVIDO desde src/shared/utils/getDiasRestantes.js
export function getDiasRestantes(fechaLimite) {
  const fechaFinal = new Date(fechaLimite);
  const hoy = new Date();
  fechaFinal.setHours(0,0,0,0);
  hoy.setHours(0,0,0,0);
  const diffTime = fechaFinal.getTime() - hoy.getTime();
  return Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 0);
}
