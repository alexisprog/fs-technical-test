import { describe, it, expect } from "vitest";
import { render, screen } from "../../test/utils";
import LoadingState from "./LoadingState";

describe("LoadingState", () => {
  it("debería renderizarse correctamente con el mensaje predeterminado", () => {
    render(<LoadingState />);

    // Verificar que el mensaje predeterminado se muestre
    expect(screen.getByText("Cargando datos...")).toBeInTheDocument();

    // Verificar que el spinner de carga está presente
    const spinner = document.querySelector(".loading-spinner");
    expect(spinner).toBeInTheDocument();

    // Verificar que el contenedor tiene la clase correcta
    const container = document.querySelector(".loading-state");
    expect(container).toBeInTheDocument();
  });

  it("debería mostrar un mensaje personalizado cuando se proporciona", () => {
    const customMessage = "Obteniendo información energética...";
    render(<LoadingState message={customMessage} />);

    // Verificar que se muestra el mensaje personalizado
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it("debería tener estilos CSS aplicados correctamente", () => {
    render(<LoadingState />);

    // Verificar que el contenedor tiene estilos aplicados
    const container = document.querySelector(".loading-state");
    expect(container).toHaveStyle({
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    });

    // Verificar que el spinner tiene la animación aplicada
    const spinner = document.querySelector(".loading-spinner");
    const computedStyle = window.getComputedStyle(spinner as Element);
    expect(computedStyle.animation).toContain("spin");
  });
});
