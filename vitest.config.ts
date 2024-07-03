import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      all: true,
      exclude: [
        "demo/",
        "packages/lint/",
        "test-results/**",
        "**/*.d.ts",
        "**/types.ts",
        "**/__tests__/**",
        "**/*.config.{js,cjs,mjs,ts}",
        "**/.{eslint,prettier,stylelint}rc.{js,cjs,yml}",
      ],
      reporter: ["html", "text", "lcov"],
    },
    reporters: ["default"],
  },
});
