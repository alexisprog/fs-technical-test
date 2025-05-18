import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "../../test/utils";
import ErrorState from "./ErrorState";

describe("ErrorState", () => {
  it("debería renderizarse correctamente con el mensaje predeterminado", () => {
    render(<ErrorState />);

    // Verificar que el mensaje predeterminado se muestre
    expect(
      screen.getByText("Ha ocurrido un error al cargar los datos.")
    ).toBeInTheDocument();

    // Verificar que el ícono de error está presente
    const errorIcon = document.querySelector(".error-icon");
    expect(errorIcon).toBeInTheDocument();
    expect(errorIcon?.textContent).toBe("⚠️");

    // Verificar que el contenedor tiene la clase correcta
    const container = document.querySelector(".error-state");
    expect(container).toBeInTheDocument();
  });

  it("debería mostrar un mensaje personalizado cuando se proporciona", () => {
    const customMessage = "Error en la conexión a la base de datos";
    render(<ErrorState message={customMessage} />);

    // Verificar que se muestra el mensaje personalizado
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it("no debería mostrar el botón de reintentar si no se proporciona onRetry", () => {
    render(<ErrorState />);

    // Verificar que el botón no está presente
    const retryButton = screen.queryByText("Reintentar");
    expect(retryButton).not.toBeInTheDocument();
  });

  it("debería mostrar el botón de reintentar y llamar a la función onRetry cuando se hace clic", () => {
    // Crear un mock de la función onRetry
    const mockOnRetry = vi.fn();

    render(<ErrorState onRetry={mockOnRetry} />);

    // Verificar que el botón está presente
    const retryButton = screen.getByText("Reintentar");
    expect(retryButton).toBeInTheDocument();

    // Hacer clic en el botón y verificar que se llame a la función
    fireEvent.click(retryButton);
    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it("debería tener estilos CSS aplicados correctamente", () => {
    render(<ErrorState />);

    // Verificar que el contenedor tiene estilos aplicados
    const container = document.querySelector(".error-state");
    expect(container).toHaveStyle({
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    });

    // Verificar que el mensaje de error tiene los estilos correctos
    const message = document.querySelector(".error-message");
    expect(message).toBeInTheDocument();
    expect(message).toHaveStyle({
      textAlign: "center",
      maxWidth: "100%",
    });
  });
});
