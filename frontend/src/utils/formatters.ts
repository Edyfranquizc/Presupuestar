// Formateo de moneda y fechas

export function formatCurrency(value: number): string {
  const formateado = new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
  return `AR$${formateado}`;
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateString));
}
export function formatCurrencyCorto(value: number): string {
  const formateado = new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
  return `$${formateado}`;
}

export function formatDateRelativo(dateString: string): string {
  const fecha = new Date(dateString);
  const hoy = new Date();
  const diffMs =
    new Date(hoy.toDateString()).getTime() - new Date(fecha.toDateString()).getTime();
  const diffDias = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDias === 0) return "Hoy";
  if (diffDias === 1) return "Ayer";
  if (diffDias > 1 && diffDias <= 30) return `Hace ${diffDias} días`;
  return formatDate(dateString);
}