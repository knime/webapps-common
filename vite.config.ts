import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";
import { fileURLToPath, URL } from "node:url";
import { svgoConfig } from "./config/svgo.config";

// https://vitejs.dev/config/
// https://vitest.dev/config/
export default defineConfig({
  plugins: [vue(), svgLoader({ svgoConfig })],
  test: {
    include: ["**/__tests__/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    environment: "jsdom",
    reporters: ["default", "junit"],
    setupFiles: [fileURLToPath(new URL("vitest.setup.ts", import.meta.url))],
    coverage: {
      all: true,
      exclude: [
        "demo/",
        "lint/",
        "buildtools/",
        "install-subDependencies.js",
        "test-results/**",
        "dist/**",
        "**/*.d.ts",
        "**/types.ts",
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
