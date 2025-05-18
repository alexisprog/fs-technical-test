import { describe, it, expect } from "vitest";
import { render, screen } from "../../../test/utils";
import { StatCard } from "./StatCard";

describe("StatCard", () => {
  it("renderiza correctamente con propiedades básicas", () => {
    render(<StatCard title="Consumo Total" value={1500} />);

    // Verificar que el título se muestra correctamente
    expect(screen.getByText("Consumo Total")).toBeInTheDocument();
    expect(screen.getByText("Consumo Total")).toHaveClass("stat-title");

    // Verificar que el valor se muestra correctamente
    expect(screen.getByText("1500")).toBeInTheDocument();
    expect(screen.getByText("1500")).toHaveClass("stat-value");

    // Verificar que no hay descripción
    const descriptions = screen
      .queryAllByText(/.*/i)
      .filter((el) => el.classList.contains("stat-description"));
    expect(descriptions.length).toBe(0);
  });

  it("renderiza correctamente con descripción", () => {
    render(
      <StatCard title="Consumo Total" value={1500} description="Valor en kWh" />
    );

    // Verificar que la descripción se muestra correctamente
    expect(screen.getByText("Valor en kWh")).toBeInTheDocument();
    expect(screen.getByText("Valor en kWh")).toHaveClass("stat-description");
  });

  it("aplica el color correctamente", () => {
    render(<StatCard title="Consumo Total" value={1500} color="#ff0000" />);

    // Verificar que el color se aplica al borde superior
    const card = screen.getByText("Consumo Total").closest(".stat-card");
    expect(card).toHaveStyle("border-top-color: #ff0000");
  });

  it("permite usar strings como valores", () => {
    render(<StatCard title="Consumo Total" value="1,500 kWh" />);

    // Verificar que el valor string se muestra correctamente
    expect(screen.getByText("1,500 kWh")).toBeInTheDocument();
  });
});
