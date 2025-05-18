import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "../backend/src/schema.gql",
  documents: [
    "src/**/*.tsx",
    "src/**/*.ts",
    "!./src/gql/",
    "!src/**/*.test.tsx",
    "!src/**/*.test.ts",
  ],
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
