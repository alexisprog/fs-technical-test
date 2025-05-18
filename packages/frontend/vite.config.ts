import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import graphqlCodegen from "vite-plugin-graphql-codegen";

export default defineConfig({
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
      "@": "/src",
    },
  },
});
