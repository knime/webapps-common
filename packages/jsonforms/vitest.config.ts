import { fileURLToPath } from "node:url";
import path from "path";

import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vitest/config";
import svgLoader from "vite-svg-loader";

import { svgoConfig } from "@knime/styles/config/svgo.config";

const getIncludedTestFiles = (mode: "integration" | "unit") => {
  if (mode === "unit") {
    return ["src/**/__tests__/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"];
  } else {
    return [
      "src/**/__integrationTests__/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
    ];
  }
};

const getExcludedTestFiles = (mode: "integration" | "unit") => {
  if (mode === "unit") {
    return getIncludedTestFiles("integration");
  } else {
    return [];
  }
};

const getTestSetupFile = (mode: "integration" | "unit") => {
  if (mode === "unit") {
    return "test-setup/vitest.setup.js";
  } else {
    return "test-setup/vitest.setup.integration.js";
  }
};

const getReportDirectory = (mode: "integration" | "unit") => {
  if (mode === "unit") {
    return "coverage/unit";
  } else {
    return "../../coverage/integration";
  }
};

// @ts-expect-error No overload matches this call.
export default defineConfig(({ mode }) => {
  const testMode = mode === "integration" ? "integration" : "unit";

  return {
    plugins: [vue(), svgLoader({ svgoConfig })],
    test: {
      include: getIncludedTestFiles(testMode),
      exclude: getExcludedTestFiles(testMode),
      environment: "jsdom",
      setupFiles: [
        fileURLToPath(new URL(getTestSetupFile(testMode), import.meta.url)),
      ],
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
        reportsDirectory: getReportDirectory(testMode),
      },
      alias: [
        {
          find: "v-calendar",
          replacement: "v-calendar",
          customResolver: {
            resolveId: (source) =>
              source === "v-calendar"
                ? path.resolve(
                    __dirname,
                    "node_modules/v-calendar/dist/es/index.js",
                  )
                : null,
          },
        },
      ],
    },
  };
});
