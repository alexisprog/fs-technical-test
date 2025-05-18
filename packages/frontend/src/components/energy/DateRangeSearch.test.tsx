import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "../../test/utils";
import DateRangeSearch from "./DateRangeSearch";

describe("DateRangeSearch", () => {
  it("renderiza correctamente", () => {
    render(<DateRangeSearch onSearch={() => {}} />);

    // Verificar que los elementos existen
    expect(
      screen.getByText("Consultar por Rango de Fechas")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Fecha de inicio:")).toBeInTheDocument();
    expect(screen.getByLabelText("Fecha de fin:")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Buscar" })).toBeInTheDocument();
  });

  it("el botón está deshabilitado cuando los campos están vacíos", () => {
    render(<DateRangeSearch onSearch={() => {}} />);

    const button = screen.getByRole("button", { name: "Buscar" });
    expect(button).toBeDisabled();
  });

  it("llama a onSearch cuando se envía el formulario con fechas válidas", () => {
    const onSearchMock = vi.fn();
    render(<DateRangeSearch onSearch={onSearchMock} />);

    // Completar los campos
    const startDateInput = screen.getByLabelText("Fecha de inicio:");
    const endDateInput = screen.getByLabelText("Fecha de fin:");

    fireEvent.change(startDateInput, { target: { value: "2023-01-01" } });
    fireEvent.change(endDateInput, { target: { value: "2023-01-31" } });

    // Enviar el formulario
    const button = screen.getByRole("button", { name: "Buscar" });
    expect(button).not.toBeDisabled();
    fireEvent.click(button);

    // Verificar que onSearch fue llamado con los valores correctos
    expect(onSearchMock).toHaveBeenCalledWith("2023-01-01", "2023-01-31");
  });

  it('muestra "Buscando..." cuando isLoading es true', () => {
    render(<DateRangeSearch onSearch={() => {}} isLoading={true} />);

    expect(screen.getByRole("button", { name: "Buscando..." })).toBeDisabled();
  });

  it('no muestra el botón "Limpiar Rango" cuando showClear es false', () => {
    render(<DateRangeSearch onSearch={() => {}} />);

    const clearButton = screen.queryByRole("button", { name: "Limpiar Rango" });
    expect(clearButton).not.toBeInTheDocument();
  });

  it('muestra el botón "Limpiar Rango" cuando showClear es true', () => {
    render(
      <DateRangeSearch
        onSearch={() => {}}
        showClear={true}
        onClear={() => {}}
      />
    );

    const clearButton = screen.getByRole("button", { name: "Limpiar Rango" });
    expect(clearButton).toBeInTheDocument();
  });

  it('llama a onClear cuando se hace clic en el botón "Limpiar Rango"', () => {
    const onClearMock = vi.fn();
    render(
      <DateRangeSearch
        onSearch={() => {}}
        showClear={true}
        onClear={onClearMock}
      />
    );

    const clearButton = screen.getByRole("button", { name: "Limpiar Rango" });
    fireEvent.click(clearButton);

    expect(onClearMock).toHaveBeenCalled();
  });

  it('resetea los valores de los campos cuando se hace clic en "Limpiar Rango"', () => {
    const onClearMock = vi.fn();
    render(
      <DateRangeSearch
        onSearch={() => {}}
        showClear={true}
        onClear={onClearMock}
      />
    );

    // Completar los campos
    const startDateInput = screen.getByLabelText("Fecha de inicio:");
    const endDateInput = screen.getByLabelText("Fecha de fin:");

    fireEvent.change(startDateInput, { target: { value: "2023-01-01" } });
    fireEvent.change(endDateInput, { target: { value: "2023-01-31" } });

    // Verificar que los campos tienen valores
    expect(startDateInput).toHaveValue("2023-01-01");
    expect(endDateInput).toHaveValue("2023-01-31");

    // Hacer clic en el botón de limpiar
    const clearButton = screen.getByRole("button", { name: "Limpiar Rango" });
    fireEvent.click(clearButton);

    // Verificar que los campos están vacíos
    expect(startDateInput).toHaveValue("");
    expect(endDateInput).toHaveValue("");

    // Verificar que onClear fue llamado
    expect(onClearMock).toHaveBeenCalled();
  });

  it('deshabilita el botón "Limpiar Rango" cuando isLoading es true', () => {
    render(
      <DateRangeSearch
        onSearch={() => {}}
        isLoading={true}
        showClear={true}
        onClear={() => {}}
      />
    );

    const clearButton = screen.getByRole("button", { name: "Limpiar Rango" });
    expect(clearButton).toBeDisabled();
  });
});
