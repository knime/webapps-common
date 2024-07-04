import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    reporters: ["default", "junit"],
    coverage: {
      all: true,
      exclude: [
        "demo/",
        "lint/",
        "buildtools/",
        "install-subDependencies.js",
        "test-results/**",
        "dist/**",
        "**/types/**/*.ts",
        "**/*.d.ts",
        "**/types.ts",
        "**/__tests__/**",
        "**/*.config.{js,cjs,mjs,ts}",
        "**/.{eslint,prettier,stylelint}rc.{js,cjs,yml}",
      ],
      reporter: ["html", "text", "lcov"],
    },
  },
});
