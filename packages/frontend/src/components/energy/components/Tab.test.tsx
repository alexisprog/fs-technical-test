import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "../../../test/utils";
import { Tab } from "./Tab";

describe("Tab", () => {
  it("renderiza correctamente con propiedades básicas", () => {
    const handleClick = vi.fn();
    render(
      <Tab
        id="test-tab"
        label="Pestaña de Prueba"
        isActive={false}
        onClick={handleClick}
      />
    );

    const tab = screen.getByRole("tab");
    expect(tab).toBeInTheDocument();
    expect(tab).toHaveTextContent("Pestaña de Prueba");
    expect(tab).toHaveAttribute("id", "test-tab");
    expect(tab).toHaveAttribute("aria-selected", "false");
    expect(tab).toHaveAttribute("aria-controls", "test-tab-panel");
    expect(tab).not.toHaveClass("active");
  });

  it("muestra correctamente cuando está activa", () => {
    const handleClick = vi.fn();
    render(
      <Tab
        id="test-tab"
        label="Pestaña de Prueba"
        isActive={true}
        onClick={handleClick}
      />
    );

    const tab = screen.getByRole("tab");
    expect(tab).toHaveClass("active");
    expect(tab).toHaveAttribute("aria-selected", "true");
  });

  it("llama a la función onClick cuando se hace clic en la pestaña", () => {
    const handleClick = vi.fn();
    render(
      <Tab
        id="test-tab"
        label="Pestaña de Prueba"
        isActive={false}
        onClick={handleClick}
      />
    );

    const tab = screen.getByRole("tab");
    fireEvent.click(tab);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
