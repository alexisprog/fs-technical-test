import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../../../test/utils";
import { ComparisonBarChart } from "./ComparisonBarChart";
import React from "react";

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
      layout,
      margin,
    }: {
      children: React.ReactNode;
      data: any[];
      layout?: string;
      margin?: Record<string, number>;
    }) => (
      <div
        data-testid="bar-chart"
        data-data-length={data.length}
        data-layout={layout}
      >
        {children}
      </div>
    ),
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    XAxis: ({ type }: { type?: string }) => (
      <div data-testid="x-axis" data-type={type} />
    ),
    YAxis: ({
      dataKey,
      type,
      width,
      tickFormatter,
    }: {
      dataKey: string;
      type?: string;
      width?: number;
      tickFormatter?: (value: any) => string;
    }) => (
      <div
        data-testid="y-axis"
        data-key={dataKey}
        data-type={type}
        data-width={width}
      >
        {tickFormatter ? "Con formateador" : "Sin formateador"}
      </div>
    ),
    Tooltip: ({
      formatter,
      labelFormatter,
    }: {
      formatter?: (value: any, name: string) => [string, string];
      labelFormatter?: (label: string) => string;
    }) => (
      <div data-testid="tooltip">
        {formatter ? "Con formateador" : "Sin formateador"}
        {labelFormatter ? " - Con formateador de etiquetas" : ""}
      </div>
    ),
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
  };
});

describe("ComparisonBarChart", () => {
  const mockSubGroups = [
    {
      id: "s1",
      type: "subgroup",
      groupId: "g1",
      title: "Solar",
      total: 800,
      color: "#F1C40F",
      parentTitle: "Generación",
    },
    {
      id: "s2",
      type: "subgroup",
      groupId: "g1",
      title: "Eólica",
      total: 500,
      color: "#3498DB",
      parentTitle: "Generación",
    },
    {
      id: "s3",
      type: "subgroup",
      groupId: "g2",
      title: "Residencial",
      total: -400,
      color: "#E74C3C",
      parentTitle: "Consumo",
    },
  ];

  it("renderiza correctamente el gráfico de comparación", () => {
    render(<ComparisonBarChart subGroups={mockSubGroups} />);

    // Verificar que se renderiza el contenedor responsive
    const container = screen.getByTestId("responsive-container");
    expect(container).toBeInTheDocument();
    expect(container).toHaveStyle("width: 100%");
    expect(container).toHaveStyle("height: 600px");

    // Verificar que se renderiza el gráfico de barras con layout vertical
    const barChart = screen.getByTestId("bar-chart");
    expect(barChart).toBeInTheDocument();
    expect(barChart).toHaveAttribute("data-data-length", "3");
    expect(barChart).toHaveAttribute("data-layout", "vertical");

    // Verificar que el eje X es de tipo numérico
    const xAxis = screen.getByTestId("x-axis");
    expect(xAxis).toBeInTheDocument();
    expect(xAxis).toHaveAttribute("data-type", "number");

    // Verificar que el eje Y tiene configuración adecuada
    const yAxis = screen.getByTestId("y-axis");
    expect(yAxis).toBeInTheDocument();
    expect(yAxis).toHaveAttribute("data-key", "title");
    expect(yAxis).toHaveAttribute("data-type", "category");
    expect(yAxis).toHaveAttribute("data-width", "150");

    // Verificar que se renderiza la barra para los valores totales
    const bar = screen.getByTestId("bar");
    expect(bar).toBeInTheDocument();
    expect(bar).toHaveAttribute("data-key", "total");
    expect(bar).toHaveAttribute("data-name", "Valor Total");

    // Verificar que se renderiza una celda para cada subgrupo
    const cells = screen.getAllByTestId("cell");
    expect(cells.length).toBe(3);

    // Verificar que el tooltip tiene formateadores
    const tooltip = screen.getByTestId("tooltip");
    expect(tooltip).toHaveTextContent("Con formateador");
    expect(tooltip).toHaveTextContent("Con formateador de etiquetas");
  });

  it("no renderiza nada con un array vacío", () => {
    render(<ComparisonBarChart subGroups={[]} />);

    // El barChart debería renderizarse pero sin datos
    const barChart = screen.getByTestId("bar-chart");
    expect(barChart).toHaveAttribute("data-data-length", "0");
  });
});
