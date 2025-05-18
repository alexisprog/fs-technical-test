import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../../../test/utils";
import { GroupsOverviewPanel } from "./GroupsOverviewPanel";
import { GroupTotal } from "../utils/dataProcessor";

// Mock de los componentes hijos
vi.mock("../components/TotalsBarChart", () => ({
  TotalsBarChart: ({ groupTotals }: { groupTotals: any[] }) => (
    <div data-testid="totals-chart">
      Gráfico de totales - {groupTotals.length} grupos
    </div>
  ),
}));

vi.mock("../components/SubgroupBarChart", () => ({
  SubgroupBarChart: ({
    group,
    vertical,
  }: {
    group: any;
    vertical?: boolean;
  }) => (
    <div data-testid={`subgroup-chart-${group.id}`}>
      Gráfico de subgrupos para {group.title} - {group.subGroups.length}{" "}
      subgrupos
      {vertical ? " (vertical)" : ""}
    </div>
  ),
}));

vi.mock("../components/ColorLegend", () => ({
  ColorLegend: () => <div data-testid="color-legend">Leyenda de colores</div>,
}));

describe("GroupsOverviewPanel", () => {
  const mockChartData = {
    mainGroups: [
      {
        id: "g1",
        type: "group",
        title: "Grupo 1",
        description: "Descripción del grupo 1",
        total: 150,
        color: "#ff0000",
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
            total: 50,
            color: "#ff5555",
            parentTitle: "Grupo 1",
          },
        ],
      },
      {
        id: "g2",
        type: "group",
        title: "Grupo 2",
        total: 200,
        color: "#0000ff",
        subGroups: [
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
      },
    ],
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
        total: 50,
        color: "#ff5555",
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
    groupTotals: [
      {
        id: "g1",
        type: "group",
        title: "Grupo 1",
        total: 150,
        positiveTotal: 150,
        negativeTotal: 0,
        color: "#ff0000",
        subgroupsCount: 2,
        positiveCount: 2,
        negativeCount: 0,
      },
      {
        id: "g2",
        type: "group",
        title: "Grupo 2",
        total: 200,
        positiveTotal: 200,
        negativeTotal: 0,
        color: "#0000ff",
        subgroupsCount: 1,
        positiveCount: 1,
        negativeCount: 0,
      },
    ],
    stats: {
      grandTotal: 350,
      totalGroups: 2,
      totalSubgroups: 3,
      largestGroup: {
        id: "g2",
        type: "group",
        title: "Grupo 2",
        total: 200,
        positiveTotal: 200,
        negativeTotal: 0,
        color: "#0000ff",
        subgroupsCount: 1,
        positiveCount: 1,
        negativeCount: 0,
      },
    },
    mainGroupIds: ["g1", "g2"],
  };

  it("renderiza correctamente", () => {
    render(<GroupsOverviewPanel chartData={mockChartData} />);

    // Verificar que el título se muestra correctamente
    expect(
      screen.getByText("Distribución de Subgrupos por Grupo Principal")
    ).toBeInTheDocument();

    // Verificar que el gráfico de totales se renderiza
    expect(screen.getByTestId("totals-chart")).toBeInTheDocument();
    expect(
      screen.getByText("Gráfico de totales - 2 grupos")
    ).toBeInTheDocument();

    // Verificar que la leyenda de colores se renderiza
    expect(screen.getByTestId("color-legend")).toBeInTheDocument();
  });

  it("renderiza todos los grupos con sus subgrupos", () => {
    render(<GroupsOverviewPanel chartData={mockChartData} />);

    // Verificar que se renderiza cada grupo
    expect(screen.getByText("Grupo 1 (2 subgrupos)")).toBeInTheDocument();
    expect(screen.getByText("Grupo 2 (1 subgrupos)")).toBeInTheDocument();

    // Verificar que se muestra la descripción cuando existe
    expect(screen.getByText("Descripción del grupo 1")).toBeInTheDocument();

    // Verificar que se renderizan los gráficos de subgrupos
    expect(screen.getByTestId("subgroup-chart-g1")).toBeInTheDocument();
    expect(screen.getByTestId("subgroup-chart-g2")).toBeInTheDocument();

    // Verificar que los gráficos de subgrupos son verticales
    expect(
      screen.getByText(
        "Gráfico de subgrupos para Grupo 1 - 2 subgrupos (vertical)"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Gráfico de subgrupos para Grupo 2 - 1 subgrupos (vertical)"
      )
    ).toBeInTheDocument();
  });
});
