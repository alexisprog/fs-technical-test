import { describe, it, expect } from "vitest";
import { render, screen } from "../../../test/utils";
import { ColorLegend } from "./ColorLegend";

describe("ColorLegend", () => {
  it("renderiza correctamente la leyenda de colores", () => {
    render(<ColorLegend />);

    // Verificar que el contenedor principal existe
    const legend = screen
      .getByText("Valores Positivos (Generación/Entrada)")
      .closest(".color-legend");
    expect(legend).toBeInTheDocument();

    // Verificar los elementos de valores positivos
    expect(
      screen.getByText("Valores Positivos (Generación/Entrada)")
    ).toBeInTheDocument();
    const positiveBox = screen.getByText(
      "Valores Positivos (Generación/Entrada)"
    ).previousSibling;
    expect(positiveBox).toHaveClass("color-box");
    expect(positiveBox).toHaveClass("positive");

    // Verificar los elementos de valores negativos
    expect(
      screen.getByText("Valores Negativos (Consumo/Salida)")
    ).toBeInTheDocument();
    const negativeBox = screen.getByText(
      "Valores Negativos (Consumo/Salida)"
    ).previousSibling;
    expect(negativeBox).toHaveClass("color-box");
    expect(negativeBox).toHaveClass("negative");
  });

  it("tiene dos elementos de color", () => {
    render(<ColorLegend />);

    const colorItems = document.querySelectorAll(".color-item");
    expect(colorItems.length).toBe(2);

    const colorBoxes = document.querySelectorAll(".color-box");
    expect(colorBoxes.length).toBe(2);
  });
});
