import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "../../../test/utils";
import LatestEnergyBalance from "./LatestEnergyBalance";
import { QueryResponse } from "../../../types/graphql";

describe("LatestEnergyBalance", () => {
  const mockRefetch = vi.fn();

  const mockData: QueryResponse = {
    latestEnergyBalance: {
      data: {
        id: "1",
        type: "energy_balance",
        attributes: {
          title: "Balance Energético Mensual",
          description: "Descripción del balance energético",
          lastUpdate: "2023-06-15",
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
            title: "Datos de Consumo",
            lastUpdate: "2023-06-15",
            content: [
              {
                id: "3",
                type: "energy_line",
                groupId: "g1",
                attributes: {
                  title: "Consumo Residencial",
                  color: "#FF5733",
                  total: 1500,
                  totalPercentage: 45,
                  values: [
                    {
                      datetime: "2023-06-01",
                      value: 500,
                      percentage: 45,
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
    render(
      <LatestEnergyBalance
        data={undefined}
        isLoading={true}
        error={null}
        refetch={mockRefetch}
      />
    );

    expect(screen.getByText("Cargando último balance...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cargando..." })).toBeDisabled();
  });

  it("muestra el error cuando hay un error", () => {
    render(
      <LatestEnergyBalance
        data={undefined}
        isLoading={false}
        error={new Error("Error en la carga")}
        refetch={mockRefetch}
      />
    );

    expect(
      screen.getByText("Error al cargar los datos del último balance")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Reintentar" })
    ).toBeInTheDocument();
  });

  it("muestra el mensaje de no hay datos cuando data es undefined", () => {
    render(
      <LatestEnergyBalance
        data={undefined}
        isLoading={false}
        error={null}
        refetch={mockRefetch}
      />
    );

    expect(screen.getByText("No hay datos disponibles")).toBeInTheDocument();
  });

  it("muestra los datos correctamente cuando hay datos disponibles", () => {
    render(
      <LatestEnergyBalance
        data={mockData}
        isLoading={false}
        error={null}
        refetch={mockRefetch}
      />
    );

    expect(screen.getByText("Balance Energético Mensual")).toBeInTheDocument();
    expect(
      screen.getByText("Descripción del balance energético", { exact: false })
    ).toBeInTheDocument();
    expect(
      screen.getByText("2023-06-15", { exact: false })
    ).toBeInTheDocument();
  });

  it("llama a refetch cuando se hace clic en el botón actualizar", () => {
    render(
      <LatestEnergyBalance
        data={mockData}
        isLoading={false}
        error={null}
        refetch={mockRefetch}
      />
    );

    const refreshButton = screen.getByRole("button", { name: "Actualizar" });
    fireEvent.click(refreshButton);

    expect(mockRefetch).toHaveBeenCalled();
  });
});
