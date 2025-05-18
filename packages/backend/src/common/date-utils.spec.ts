import { formatDateForApi } from "./date-utils";

describe("formatDateForApi", () => {
  // Prueba para objeto Date con type="start"
  it("should format a Date object for start_date", () => {
    const date = new Date("2025-10-27T10:00:00.000Z"); // Usamos UTC para control
    const formatted = formatDateForApi(date, "start");
    expect(formatted).toBe("2025-10-27T00:00");
  });

  // Prueba para objeto Date con type="end"
  it("should format a Date object for end_date", () => {
    const date = new Date("2025-10-27T10:00:00.000Z"); // Usamos UTC para control
    const formatted = formatDateForApi(date, "end");
    expect(formatted).toBe("2025-10-27T23:59");
  });

  // Prueba para string de fecha con type="start"
  it("should format a date string (YYYY-MM-DD) for start_date", () => {
    const dateString = "2025-11-15";
    const formatted = formatDateForApi(dateString, "start");
    expect(formatted).toBe("2025-11-15T00:00");
  });

  // Prueba para string de fecha con type="end"
  it("should format a date string (YYYY-MM-DD) for end_date", () => {
    const dateString = "2025-11-15";
    const formatted = formatDateForApi(dateString, "end");
    expect(formatted).toBe("2025-11-15T23:59");
  });

  // Prueba para string de fecha ISO con type="start" (debería ignorar la hora original)
  it("should format an ISO date string for start_date, ignoring original time", () => {
    const dateString = "2024-01-20T15:30:00.000Z";
    const formatted = formatDateForApi(dateString, "start");
    expect(formatted).toBe("2024-01-20T00:00");
  });

  // Prueba para string de fecha ISO con type="end" (debería ignorar la hora original)
  it("should format an ISO date string for end_date, ignoring original time", () => {
    const dateString = "2024-01-20T15:30:00.000Z";
    const formatted = formatDateForApi(dateString, "end");
    expect(formatted).toBe("2024-01-20T23:59");
  });

  // Prueba para fecha inválida (objeto Date con NaN)
  it("should throw an error for an invalid Date object", () => {
    const invalidDate = new Date("invalid date string");
    expect(() => formatDateForApi(invalidDate, "start")).toThrow(
      "Fecha inválida: Invalid Date"
    );
  });

  // Prueba para string de fecha con formato inválido
  it("should throw an error for an invalid date string format", () => {
    const invalidString = "2025/11/15";
    expect(() => formatDateForApi(invalidString, "start")).toThrow(
      "Formato de fecha inválido: 2025/11/15"
    );
  });

  // Prueba para tipo de fecha no soportado
  it("should throw an error for an unsupported date type", () => {
    // @ts-ignore: Testing invalid input
    expect(() => formatDateForApi(12345 as any, "start")).toThrow(
      "Tipo de fecha no soportado: number"
    );
  });
});
