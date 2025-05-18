import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "../backend/src/schema.gql", // Ruta al esquema GraphQL del backend
  documents: ["src/**/*.tsx", "src/**/*.ts"], // Archivos donde escribiremos nuestras operaciones GraphQL
  ignoreNoDocuments: true,
  generates: {
    "./src/gql/": {
      preset: "client",
      plugins: [],
      config: {
        useTypeImports: true,
        dedupeFragments: true,
        inlineFragmentTypes: "combine",
        defaultScalarType: "unknown",
        fragmentMasking: false,
      },
    },
  },
};

export default config;
