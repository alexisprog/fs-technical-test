import { describe, it, expect } from "vitest";
import { render, screen } from "../../../test/utils";
import { TabPanel } from "./TabPanel";

describe("TabPanel", () => {
  it("renderiza correctamente cuando está activo", () => {
    render(
      <TabPanel id="test-panel" isActive={true}>
        <div data-testid="panel-content">Contenido del Panel</div>
      </TabPanel>
    );

    const panel = screen.getByRole("tabpanel");
    expect(panel).toBeInTheDocument();
    expect(panel).toHaveAttribute("id", "test-panel-panel");
    expect(panel).toHaveAttribute("aria-labelledby", "test-panel");
    expect(panel).toHaveClass("tab-panel");

    // Verificar que el contenido se renderiza
    expect(screen.getByTestId("panel-content")).toBeInTheDocument();
    expect(screen.getByText("Contenido del Panel")).toBeInTheDocument();
  });

  it("no renderiza nada cuando no está activo", () => {
    render(
      <TabPanel id="test-panel" isActive={false}>
        <div data-testid="panel-content">Contenido del Panel</div>
      </TabPanel>
    );

    // Verificar que no hay tabpanel en el documento
    const panels = screen.queryAllByRole("tabpanel");
    expect(panels.length).toBe(0);

    // Verificar que el contenido no se renderiza
    expect(screen.queryByTestId("panel-content")).not.toBeInTheDocument();
    expect(screen.queryByText("Contenido del Panel")).not.toBeInTheDocument();
  });
});
