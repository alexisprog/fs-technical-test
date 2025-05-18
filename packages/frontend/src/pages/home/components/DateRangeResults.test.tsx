import { describe, it, expect } from "vitest";
import { render, screen } from "../../../test/utils";
import DateRangeResults from "./DateRangeResults";
import { QueryByDateResponse } from "../../../types/graphql";

describe("DateRangeResults", () => {
  const mockData: QueryByDateResponse = {
    energyBalancesByDateRange: {
      data: {
        id: "1",
        type: "energy_balance",
        attributes: {
          title: "Balance Energético por Rango",
          description: "Datos del periodo seleccionado",
          lastUpdate: "2025-07-15",
        },
        meta: {
          cacheControl: {
            cache: "public",
          },
        },
      },
      included: [
        {
          id: "2",
          type: "chart_data",
          attributes: {
            title: "Datos de Producción",
            lastUpdate: "2025-07-15",
            content: [
              {
                id: "3",
                type: "energy_line",
                groupId: "g1",
                attributes: {
                  title: "Producción Eólica",
                  color: "#33FF57",
                  total: 2500,
                  totalPercentage: 65,
                  values: [
                    {
                      datetime: "2025-07-01",
                      value: 800,
                      percentage: 65,
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };

  it("muestra el mensaje de carga cuando isLoading es true", () => {
    render(<DateRangeResults data={undefined} isLoading={true} error={null} />);

    expect(screen.getByText("Cargando resultados...")).toBeInTheDocument();
  });

  it("muestra el error cuando hay un error", () => {
    render(
      <DateRangeResults
        data={undefined}
        isLoading={false}
        error={new Error("Error en la búsqueda")}
      />
    );

    expect(
      screen.getByText("Error al cargar los datos por rango de fechas")
    ).toBeInTheDocument();
  });

  it("muestra el mensaje de no encontrado cuando no hay datos", () => {
    render(
      <DateRangeResults data={undefined} isLoading={false} error={null} />
    );

    expect(
      screen.getByText("No se encontraron datos para el rango seleccionado")
    ).toBeInTheDocument();
  });

  it("muestra los datos correctamente cuando hay datos disponibles", () => {
    render(<DateRangeResults data={mockData} isLoading={false} error={null} />);

    expect(
      screen.getByText("Balance Energético por Rango")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Datos del periodo seleccionado", { exact: false })
    ).toBeInTheDocument();
    expect(
      screen.getByText("2025-07-15", { exact: false })
    ).toBeInTheDocument();
  });
});
