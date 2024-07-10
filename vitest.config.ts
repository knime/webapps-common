import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    reporters: ["default", "junit"],
    coverage: {
      all: true,
      exclude: [
        "demo/",
        "packages/lint/",
        "packages/licenses/",
        "packages/utils/test-utils/",
        "test-results/**",
        "**/dist/**",
        "**/types/**/*.ts",
        "**/*.d.ts",
        "**/types.ts",
        "**/__tests__/**",
        "vitest.workspace.ts",
        "**/vitest.setup.ts",
        "**/*.config.{js,cjs,mjs,ts}",
        "**/.{eslint,prettier,stylelint}rc.{js,cjs,yml}",
      ],
      reporter: ["html", "text", "lcov"],
    },
    outputFile: {
      // needed for Bitbucket Pipeline
      // see https://support.atlassian.com/bitbucket-cloud/docs/test-reporting-in-pipelines/
      junit: "test-results/junit.xml",
    },
  },
});
