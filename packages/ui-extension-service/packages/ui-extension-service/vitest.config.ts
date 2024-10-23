import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("src/.", import.meta.url)),
    },
  },
  test: {
    include: ["**/__tests__/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    environment: "jsdom",
    root: fileURLToPath(new URL("./", import.meta.url)),
    coverage: {
      all: true,
      exclude: [
        "coverage/**",
        "dist/**",
        "**/*.d.ts",
        "**/__tests__/**",
        "**/{vite,vitest,postcss,lint-staged}.config.{js,cjs,mjs,ts}",
        "**/.{eslint,prettier,stylelint}rc.{js,cjs,yml}",
        "**/types/**",
      ],
      reporter: ["html", "text", "lcov"],
    },
    outputFile: {
      junit: "test-results/junit.xml", // needed for Bitbucket Pipeline, see https://support.atlassian.com/bitbucket-cloud/docs/test-reporting-in-pipelines/
    },
  },
});
