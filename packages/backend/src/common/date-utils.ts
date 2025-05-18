/**
 * Formatea una fecha al formato requerido por la API: YYYY-MM-DDTHH:MM
 * Aplica horas específicas según el tipo:
 * - Para start_date: 00:00
 * - Para end_date: 23:59
 *
 * @param date Fecha a formatear (Date o string)
 * @param type Tipo de fecha ('start' o 'end')
 * @returns Fecha formateada como string
 */
export function formatDateForApi(
  date: Date | string,
  type: "start" | "end" = "start"
): string {
  // Manejar string de fecha (ISO o similar)
  if (typeof date === "string") {
    // Extraer solo la parte de la fecha del string, ignorando zona horaria
    // Formato esperado: YYYY-MM-DD
    const dateString = date.split("T")[0];
    if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      throw new Error(`Formato de fecha inválido: ${date}`);
    }

    // Añadir la hora según el tipo
    const timeString = type === "start" ? "T00:00" : "T23:59";
    return dateString + timeString;
  }

  // Manejar objeto Date
  if (date instanceof Date) {
    if (isNaN(date.getTime())) {
      throw new Error(`Fecha inválida: ${date}`);
    }

    // Usar getUTC* para evitar problemas de zona horaria
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");

    // Aplicar horas específicas según el tipo
    const hours = type === "start" ? "00" : "23";
    const minutes = type === "start" ? "00" : "59";

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  throw new Error(`Tipo de fecha no soportado: ${typeof date}`);
}
