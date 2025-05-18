import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../../../test/utils";
import { TotalsBarChart } from "./TotalsBarChart";

// Mock para Recharts
vi.mock("recharts", () => {
  const OriginalModule = vi.importActual("recharts");
  return {
    ...OriginalModule,
    ResponsiveContainer: ({
      children,
      width,
      height,
    }: {
      children: React.ReactNode;
      width: string | number;
      height: string | number;
    }) => (
      <div data-testid="responsive-container" style={{ width, height }}>
        {children}
      </div>
    ),
    BarChart: ({
      children,
      data,
    }: {
      children: React.ReactNode;
      data: any[];
      margin?: Record<string, number>;
    }) => (
      <div data-testid="bar-chart" data-data-length={data.length}>
        {children}
      </div>
    ),
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    XAxis: ({ dataKey }: { dataKey: string }) => (
      <div data-testid="x-axis" data-key={dataKey} />
    ),
    YAxis: () => <div data-testid="y-axis" />,
    Tooltip: () => <div data-testid="tooltip" />,
    Legend: () => <div data-testid="legend" />,
    Bar: ({
      children,
      dataKey,
      name,
    }: {
      children: React.ReactNode;
      dataKey: string;
      name: string;
    }) => (
      <div data-testid="bar" data-key={dataKey} data-name={name}>
        {children}
      </div>
    ),
    Cell: ({ fill }: { fill: string }) => (
      <div data-testid="cell" data-fill={fill} />
    ),
    LabelList: ({ dataKey }: { dataKey: string }) => (
      <div data-testid="label-list" data-key={dataKey} />
    ),
  };
});

describe("TotalsBarChart", () => {
  const mockGroupTotals = [
    {
      id: "g1",
      type: "group",
      title: "Generación",
      total: 1500,
      positiveTotal: 1500,
      negativeTotal: 0,
      color: "#44B39D",
      subgroupsCount: 3,
      positiveCount: 3,
      negativeCount: 0,
    },
    {
      id: "g2",
      type: "group",
      title: "Consumo",
      total: -800,
      positiveTotal: 0,
      negativeTotal: -800,
      color: "#E74C3C",
      subgroupsCount: 2,
      positiveCount: 0,
      negativeCount: 2,
    },
  ];

  it("renderiza correctamente el gráfico con los datos proporcionados", () => {
    render(<TotalsBarChart groupTotals={mockGroupTotals} />);

    // Verificar que se renderiza el contenedor responsive
    const container = screen.getByTestId("responsive-container");
    expect(container).toBeInTheDocument();
    expect(container).toHaveStyle("width: 100%");
    expect(container).toHaveStyle("height: 400px");

    // Verificar que se renderiza el gráfico de barras con los datos correctos
    const barChart = screen.getByTestId("bar-chart");
    expect(barChart).toBeInTheDocument();
    expect(barChart).toHaveAttribute("data-data-length", "2");

    // Verificar que se renderiza el eje X con la propiedad correcta
    const xAxis = screen.getByTestId("x-axis");
    expect(xAxis).toBeInTheDocument();
    expect(xAxis).toHaveAttribute("data-key", "title");

    // Verificar que se renderiza la barra para los valores totales
    const bar = screen.getByTestId("bar");
    expect(bar).toBeInTheDocument();
    expect(bar).toHaveAttribute("data-key", "total");
    expect(bar).toHaveAttribute("data-name", "Valor Total");

    // Verificar que se renderiza una celda para cada grupo
    const cells = screen.getAllByTestId("cell");
    expect(cells.length).toBe(2);
  });

  it("no renderiza nada con un array vacío", () => {
    render(<TotalsBarChart groupTotals={[]} />);

    // El barChart debería renderizarse pero sin datos
    const barChart = screen.getByTestId("bar-chart");
    expect(barChart).toHaveAttribute("data-data-length", "0");
  });
});
