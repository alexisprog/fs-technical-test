module.exports = {
  projects: [
    {
      displayName: "unit",
      rootDir: ".",
      testEnvironment: "node",
      transform: {
        "^.+\\.ts$": "ts-jest",
      },
      moduleFileExtensions: ["js", "json", "ts"],
      testMatch: ["<rootDir>/src/**/*.spec.ts"],
      collectCoverageFrom: [
        "<rootDir>/src/**/*.ts",
        "!<rootDir>/src/**/*.module.ts",
        "!<rootDir>/src/main.ts",
      ],
      coverageDirectory: "<rootDir>/coverage/unit",
      moduleNameMapper: {
        "^src/(.*)$": "<rootDir>/src/$1",
      },
    },
    {
      displayName: "e2e",
      rootDir: ".",
      testEnvironment: "node",
      testRegex: "./test/.*\\.e2e-spec\.ts$",
      transform: {
        "^.+\\.(t|j)s$": [
          "ts-jest",
          {
            tsconfig: "<rootDir>/tsconfig.json",
            isolatedModules: true,
          },
        ],
      },
      moduleFileExtensions: ["js", "json", "ts"],
      collectCoverageFrom: ["<rootDir>/**/*.ts"],
      coverageDirectory: "<rootDir>/coverage/e2e",
      moduleNameMapper: {
        "^src/(.*)$": "<rootDir>/src/$1",
      },
    },
  ],
};
