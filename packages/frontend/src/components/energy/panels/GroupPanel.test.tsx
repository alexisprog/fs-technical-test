import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../../../test/utils";
import { GroupPanel } from "./GroupPanel";

// Mock del componente SubgroupBarChart
vi.mock("../components/SubgroupBarChart", () => ({
  SubgroupBarChart: ({ group }: { group: any }) => (
    <div data-testid="subgroup-chart">
      Gráfico de subgrupos para {group.title} - {group.subGroups.length}{" "}
      subgrupos
    </div>
  ),
}));

describe("GroupPanel", () => {
  const mockGroup = {
    id: "g1",
    type: "group",
    title: "Grupo de Energía",
    description: "Descripción del grupo de energía",
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
        parentTitle: "Grupo de Energía",
      },
      {
        id: "2",
        type: "subgroup",
        groupId: "g1",
        title: "Subgrupo 2",
        total: 50,
        color: "#ff5555",
        parentTitle: "Grupo de Energía",
      },
    ],
  };

  const mockGroupWithoutDesc = {
    id: "g2",
    type: "group",
    title: "Grupo sin Descripción",
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
        parentTitle: "Grupo sin Descripción",
      },
    ],
  };

  it("renderiza correctamente con descripción", () => {
    render(<GroupPanel group={mockGroup} />);

    // Verificar que el título se muestra correctamente
    expect(screen.getByText("Grupo de Energía")).toBeInTheDocument();

    // Verificar que la descripción se muestra
    expect(
      screen.getByText("Descripción del grupo de energía")
    ).toBeInTheDocument();

    // Verificar que el título de la sección se muestra correctamente
    expect(
      screen.getByText("Valores de Subgrupos en Grupo de Energía")
    ).toBeInTheDocument();

    // Verificar que el gráfico se renderiza
    expect(screen.getByTestId("subgroup-chart")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Gráfico de subgrupos para Grupo de Energía - 2 subgrupos"
      )
    ).toBeInTheDocument();
  });

  it("renderiza correctamente sin descripción", () => {
    render(<GroupPanel group={mockGroupWithoutDesc} />);

    // Verificar que el título se muestra correctamente
    expect(screen.getByText("Grupo sin Descripción")).toBeInTheDocument();

    // Verificar que la descripción específica del grupo no existe
    expect(
      screen.queryByText("Descripción del grupo sin Descripción")
    ).not.toBeInTheDocument();

    // Verificar que el contenedor de descripción no existe
    const descriptionContainer = document.querySelector(".group-description");
    expect(descriptionContainer).toBeNull();

    // Verificar que el título de la sección se muestra correctamente
    expect(
      screen.getByText("Valores de Subgrupos en Grupo sin Descripción")
    ).toBeInTheDocument();

    // Verificar que el gráfico se renderiza
    expect(screen.getByTestId("subgroup-chart")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Gráfico de subgrupos para Grupo sin Descripción - 1 subgrupos"
      )
    ).toBeInTheDocument();
  });
});
