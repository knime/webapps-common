// / <reference types="vitest" />
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
// import svgLoader from "vite-svg-loader";
// import { svgoConfig } from "webapps-common/config/svgo.config";

// TODO svg loader

// TODO maybe the build is not needed at all

const relPath = (path: String) => fileURLToPath(new URL(path, import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      tsconfigPath: relPath("./tsconfig.app.json"), // is this tsconfig at the right location?
    }),
    cssInjectedByJsPlugin({}), // not supported natively in Vite yet, see https://github.com/vitejs/vite/issues/1579]
  ],
  test: {
    include: ["**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
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
  build: {
    lib: {
      entry: [relPath("src/index.ts")],
      formats: ["es"],
    },
    rollupOptions: {
      external: ["vue"],
    },
  },
  // TODO tests
});
