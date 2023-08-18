import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import type { LibraryOptions } from "vite";
import { loadEnv } from "vite";
import postcss from "postcss";
// @ts-ignore
import scopify from "postcss-scopify";

const camelCase = (input: string) => {
  return input
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
};

const COMPONENTS = [
  "NodeDialog",
  "TableView",
  "DeferredTableView",
  "TextView",
  "FlowVariableView",
  "ImageView",
] as const;

type ComponentLibraries = (typeof COMPONENTS)[number];

const getComponentLibraryOptions = (
  name: ComponentLibraries,
  overrideName?: string,
): LibraryOptions => ({
  name: (overrideName || name).toLowerCase(),
  entry: fileURLToPath(
    new URL(`./src/${camelCase(name)}/${name}.vue`, import.meta.url),
  ),
  fileName: name,
  formats: ["umd"],
});

/**
 * NOTE: If you add a new library, make sure it is wrapped in a <div> with the
 * class `knime-ui-LIBNAME` where LIBNAME is the name you dfine in this object as key.
 *
 * See below how the CSS code is scoped in order to prevent problems with webapps-common in knime-ui.
 */
const libraries: Record<ComponentLibraries, LibraryOptions> = {
  NodeDialog: getComponentLibraryOptions("NodeDialog", "defaultdialog"),
  TableView: getComponentLibraryOptions("TableView"),
  DeferredTableView: getComponentLibraryOptions("DeferredTableView"),
  TextView: getComponentLibraryOptions("TextView"),
  FlowVariableView: getComponentLibraryOptions("FlowVariableView"),
  ImageView: getComponentLibraryOptions("ImageView"),
};

const getCurrentLibrary = (mode: ComponentLibraries) => {
  if (mode in libraries) {
    return libraries[mode];
  }

  return false;
};

// https://vitest.dev/config/
export default defineConfig(({ mode }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    define: {
      "process.env": env, // needed by v-calendar
    },
    plugins: [
      vue(),
      svgLoader(),
      // not supported natively in Vite yet, see https://github.com/vitejs/vite/issues/1579]
      cssInjectedByJsPlugin({
        preRenderCSSCode: (cssCode) => {
          // add a prefix class to every rule; this helps mitigate CSS problems with duplicated webapps-common rules
          return postcss()
            .use(scopify(`.knime-ui-${mode}`))
            .process(cssCode).css;
        },
      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "@@": fileURLToPath(new URL(".", import.meta.url)),
      },
      dedupe: [
        "vue", // see https://github.com/vuejs/core/issues/4344#issuecomment-899064501
      ],
    },
    build: {
      lib: getCurrentLibrary(mode as ComponentLibraries),
      emptyOutDir: false,
      rollupOptions: {
        external: ["vue"],
        output: {
          globals: {
            vue: "Vue", // maps to window.Vue which must be provided by the consuming app
          },
        },
      },
    },
    test: {
      include: ["src/**/__tests__/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
      environment: "jsdom",
      reporters: ["default", "junit"],
      deps: { inline: ["consola"] },
      setupFiles: [
        fileURLToPath(new URL("test-setup/vitest.setup.js", import.meta.url)),
      ],
      coverage: {
        all: true,
        exclude: [
          "buildtools/",
          "coverage/**",
          "dist/**",
          "webapps-common/**",
          "lib/**",
          "**/*.d.ts",
          "**/__tests__/**",
          "test-setup/**",
          "**/{vite,vitest,postcss}.config.{js,cjs,mjs,ts}",
          "**/.{eslint,prettier,stylelint}rc.{js,cjs,yml}",
          "**/types/**",
        ],
        reporter: ["html", "text", "lcov"],
      },
      outputFile: {
        junit: "test-results/junit.xml", // needed for Bitbucket Pipeline, see https://support.atlassian.com/bitbucket-cloud/docs/test-reporting-in-pipelines/
      },
    },
    envPrefix: "KNIME_",
  };
});
