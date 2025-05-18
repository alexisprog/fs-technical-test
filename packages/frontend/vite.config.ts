import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import graphqlCodegen from "vite-plugin-graphql-codegen";
import path from "path";
import { defineConfig as defineVitestConfig } from "vitest/config";

export default defineVitestConfig({
  plugins: [react(), graphqlCodegen()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    watch: {
      usePolling: true,
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./src/test/setup.ts"],
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        // Archivos y directorios excluidos de la cobertura
        "src/main.tsx",
        "codegen.ts",
        "src/config/**",
        "src/gql/**",
        "src/graphql/**",
        "src/hooks/**",
        "src/test/**",
        "src/types/**",
        "node_modules/**",
        "**/*.d.ts",
        "**/*.test.{ts,tsx}",
        "**/*.config.{ts,js}",
        "**/_*.*",
        "**/coverage/**",
      ],
    },
  },
});
