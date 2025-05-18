import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../../../test/utils";
import SearchSection from "./SearchSection";

describe("SearchSection", () => {
  const mockOnSearch = vi.fn();
  const mockOnClear = vi.fn();

  it("renderiza el componente DateRangeSearch correctamente", () => {
    render(
      <SearchSection
        onSearch={mockOnSearch}
        onClear={mockOnClear}
        isLoading={false}
        showClear={false}
      />
    );

    expect(
      screen.getByText("Consultar por Rango de Fechas")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Fecha de inicio:")).toBeInTheDocument();
    expect(screen.getByLabelText("Fecha de fin:")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Buscar" })).toBeInTheDocument();
  });

  it("pasa correctamente la prop isLoading a DateRangeSearch", () => {
    render(
      <SearchSection
        onSearch={mockOnSearch}
        onClear={mockOnClear}
        isLoading={true}
        showClear={false}
      />
    );

    expect(screen.getByRole("button", { name: "Buscando..." })).toBeDisabled();
  });

  it("muestra el botón de limpiar cuando showClear es true", () => {
    render(
      <SearchSection
        onSearch={mockOnSearch}
        onClear={mockOnClear}
        isLoading={false}
        showClear={true}
      />
    );

    expect(
      screen.getByRole("button", { name: "Limpiar Rango" })
    ).toBeInTheDocument();
  });

  it("no muestra el botón de limpiar cuando showClear es false", () => {
    render(
      <SearchSection
        onSearch={mockOnSearch}
        onClear={mockOnClear}
        isLoading={false}
        showClear={false}
      />
    );

    expect(
      screen.queryByRole("button", { name: "Limpiar Rango" })
    ).not.toBeInTheDocument();
  });
});
