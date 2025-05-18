import { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";

// Función para renderizar componentes con todos los providers necesarios
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper"> & {
    mocks?: any[];
    addTypename?: boolean;
  }
) {
  const { mocks = [], addTypename = false, ...rest } = options || {};

  return render(ui, {
    wrapper: ({ children }) => (
      <MockedProvider mocks={mocks} addTypename={addTypename}>
        {children}
      </MockedProvider>
    ),
    ...rest,
  });
}

// Exportar todo de React Testing Library para tener un solo punto de importación
export * from "@testing-library/react";
export { renderWithProviders as render };
