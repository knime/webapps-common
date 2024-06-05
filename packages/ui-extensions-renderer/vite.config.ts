import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [vue()],
  test: {
    include: ["**/__tests__/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    environment: "jsdom",
    reporters: ["default", "junit"],
    coverage: {
      all: true,
      exclude: [
        "test-results/**",
        "dist/**",
        "**/*.d.ts",
        "**/__tests__/**",
        "**/*.config.{js,cjs,mjs,ts}",
        "**/.{eslint,prettier,stylelint}rc.{js,cjs,yml}",
      ],
      reporter: ["html", "text", "lcov"],
    },
    outputFile: {
      junit: "test-results/junit.xml", // needed for Bitbucket Pipeline, see https://support.atlassian.com/bitbucket-cloud/docs/test-reporting-in-pipelines/
    },
  },
});
