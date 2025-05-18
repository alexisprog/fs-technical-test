import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../../../test/utils";
import { SubgroupBarChart } from "./SubgroupBarChart";
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
        data-layout={layout || "horizontal"}
      >
        {children}
      </div>
    ),
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    XAxis: ({ type, dataKey }: { type?: string; dataKey?: string }) => (
      <div data-testid="x-axis" data-type={type} data-key={dataKey} />
    ),
    YAxis: ({
      dataKey,
      type,
      width,
    }: {
      dataKey?: string;
      type?: string;
      width?: number;
    }) => (
      <div
        data-testid="y-axis"
        data-key={dataKey}
        data-type={type}
        data-width={width}
      />
    ),
    Tooltip: () => <div data-testid="tooltip" />,
    Legend: () => <div data-testid="legend" />,
    Bar: ({
      children,
      dataKey,
      name,
      fill,
    }: {
      children: React.ReactNode;
      dataKey: string;
      name: string;
      fill?: string;
    }) => (
      <div
        data-testid="bar"
        data-key={dataKey}
        data-name={name}
        data-fill={fill}
      >
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

describe("SubgroupBarChart", () => {
  const mockGroup = {
    id: "g1",
    type: "group",
    title: "Generación",
    description: "Energía generada",
    total: 1500,
    color: "#44B39D",
    subGroups: [
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
        groupId: "g1",
        title: "Hidráulica",
        total: 200,
        color: "#1ABC9C",
        parentTitle: "Generación",
      },
    ],
  };

  it("renderiza correctamente el gráfico horizontal por defecto", () => {
    render(<SubgroupBarChart group={mockGroup} />);

    // Verificar que se renderiza el contenedor responsive
    const container = screen.getByTestId("responsive-container");
    expect(container).toBeInTheDocument();
    expect(container).toHaveStyle("width: 100%");
    expect(container).toHaveStyle("height: 400px");

    // Verificar que se renderiza el gráfico de barras con orientación horizontal
    const barChart = screen.getByTestId("bar-chart");
    expect(barChart).toBeInTheDocument();
    expect(barChart).toHaveAttribute("data-data-length", "3");
    expect(barChart).toHaveAttribute("data-layout", "horizontal");

    // Verificar que se renderiza el eje X con la propiedad correcta
    const xAxis = screen.getByTestId("x-axis");
    expect(xAxis).toBeInTheDocument();
    expect(xAxis).toHaveAttribute("data-key", "title");

    // Verificar que se renderiza la barra para los valores totales
    const bar = screen.getByTestId("bar");
    expect(bar).toBeInTheDocument();
    expect(bar).toHaveAttribute("data-key", "total");
    expect(bar).toHaveAttribute("data-name", "Valor Total");
    expect(bar).toHaveAttribute("data-fill", "#44B39D");

    // Verificar que se renderiza una celda para cada subgrupo
    const cells = screen.getAllByTestId("cell");
    expect(cells.length).toBe(3);
  });

  it("renderiza correctamente el gráfico vertical cuando se especifica", () => {
    render(<SubgroupBarChart group={mockGroup} vertical={true} />);

    // Verificar que se renderiza el contenedor responsive con altura calculada
    const container = screen.getByTestId("responsive-container");
    expect(container).toBeInTheDocument();

    // Verificar que se renderiza el gráfico de barras con orientación vertical
    const barChart = screen.getByTestId("bar-chart");
    expect(barChart).toBeInTheDocument();
    expect(barChart).toHaveAttribute("data-layout", "vertical");

    // Verificar que el eje Y tiene configuración para gráfico vertical
    const yAxis = screen.getByTestId("y-axis");
    expect(yAxis).toBeInTheDocument();
    expect(yAxis).toHaveAttribute("data-key", "title");
    expect(yAxis).toHaveAttribute("data-type", "category");
    expect(yAxis).toHaveAttribute("data-width", "150");
  });
});
