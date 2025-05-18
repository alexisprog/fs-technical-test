import "@testing-library/jest-dom";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Limpia automáticamente después de cada prueba
afterEach(() => {
  cleanup();
});

// Guardamos la función original de console.error antes de mockearla
const originalConsoleError = console.error;

// Configuración global para suprimir warnings de React en las pruebas
window.console.error = (...args: any[]) => {
  const ignoreMessages = ["Warning: ReactDOM.render is no longer supported"];

  // No mostrar ciertos mensajes de warning en las pruebas
  const shouldIgnore = ignoreMessages.some((message) => {
    return typeof args[0] === "string" && args[0].includes(message);
  });

  if (!shouldIgnore) {
    // Llamamos a la función original
    originalConsoleError(...args);
  }
};
