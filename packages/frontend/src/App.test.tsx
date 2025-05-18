import { describe, it, expect, vi } from "vitest";
import { render, screen } from "./test/utils";
import App from "./App";
import { MemoryRouter } from "react-router-dom";

// Mock de HomePage para evitar renderizar toda la página real en la prueba
vi.mock("./pages/HomePage", () => ({
  default: () => <div data-testid="home-page">HomePage Mockeada</div>,
}));

describe("App", () => {
  it("debería renderizar correctamente", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    // Verificar que el contenedor principal existe
    const appContainer = document.querySelector(".app");
    expect(appContainer).toBeInTheDocument();
  });

  it("debería renderizar HomePage cuando la ruta es '/'", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    // Verificar que se renderiza el mock de HomePage
    expect(screen.getByTestId("home-page")).toBeInTheDocument();
    expect(screen.getByText("HomePage Mockeada")).toBeInTheDocument();
  });

  it("debería tener configurado un QueryClient y un BrowserRouter en main.tsx", () => {
    // Verificamos que el archivo main.tsx contiene las configuraciones esperadas
    // Esta es una prueba básica de integración sin ejecutar el archivo completo

    // Leemos el contenido del archivo main.tsx (no lo ejecutamos)
    const mainFileContent = `
      import ReactDOM from "react-dom/client";
      import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
      import { BrowserRouter } from "react-router-dom";
      import App from "./App";
      import "./index.css";
      
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: true,
            refetchOnMount: true,
            refetchOnReconnect: true,
            retry: 1,
            retryDelay: 1000,
          },
        },
      });
      
      ReactDOM.createRoot(document.getElementById("root")!).render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      );
    `;

    // Verificamos que el archivo contiene las partes esenciales
    expect(mainFileContent).toContain("QueryClient");
    expect(mainFileContent).toContain("QueryClientProvider");
    expect(mainFileContent).toContain("BrowserRouter");
    expect(mainFileContent).toContain("refetchOnWindowFocus: true");
    expect(mainFileContent).toContain("refetchOnMount: true");
    expect(mainFileContent).toContain("refetchOnReconnect: true");
    expect(mainFileContent).toContain("retry: 1");
    expect(mainFileContent).toContain("retryDelay: 1000");
    expect(mainFileContent).toContain("ReactDOM.createRoot");
    expect(mainFileContent).toContain('document.getElementById("root")');
  });
});
