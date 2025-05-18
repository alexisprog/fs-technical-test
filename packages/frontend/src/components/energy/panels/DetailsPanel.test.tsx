import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../../../test/utils";
import { DetailsPanel } from "./DetailsPanel";

// Mock del componente ComparisonBarChart
vi.mock("../components/ComparisonBarChart", () => ({
  ComparisonBarChart: ({ subGroups }: { subGroups: any[] }) => (
    <div data-testid="comparison-chart">
      Gráfico de comparación - {subGroups.length} subgrupos
    </div>
  ),
}));

describe("DetailsPanel", () => {
  const mockChartData = {
    mainGroups: [],
    subGroups: [
      {
        id: "1",
        type: "subgroup",
        groupId: "g1",
        title: "Subgrupo 1",
        total: 100,
        color: "#ff0000",
        parentTitle: "Grupo 1",
      },
      {
        id: "2",
        type: "subgroup",
        groupId: "g1",
        title: "Subgrupo 2",
        total: -50,
        color: "#00ff00",
        parentTitle: "Grupo 1",
      },
      {
        id: "3",
        type: "subgroup",
        groupId: "g2",
        title: "Subgrupo 3",
        total: 200,
        color: "#0000ff",
        parentTitle: "Grupo 2",
      },
    ],
    groupTotals: [],
    stats: {},
    mainGroupIds: [],
  };

  it("renderiza correctamente", () => {
    render(<DetailsPanel chartData={mockChartData} />);

    // Verificar que el título se muestra correctamente
    expect(
      screen.getByText("Comparación de Todos los Subgrupos")
    ).toBeInTheDocument();

    // Verificar que el gráfico se renderiza
    expect(screen.getByTestId("comparison-chart")).toBeInTheDocument();
    expect(
      screen.getByText("Gráfico de comparación - 3 subgrupos")
    ).toBeInTheDocument();
  });

  it("pasa los subgrupos correctos al gráfico de comparación", () => {
    render(<DetailsPanel chartData={mockChartData} />);

    // Verificar que se pasaron los 3 subgrupos al gráfico
    expect(
      screen.getByText("Gráfico de comparación - 3 subgrupos")
    ).toBeInTheDocument();
  });
});
