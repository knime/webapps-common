import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";
import type { LibraryFormats, LibraryOptions } from "vite";
import { loadEnv } from "vite";
// only used by obsolete UMD format
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

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

const getComponentLibraryOptions =
  (
    name: ComponentLibraries,
    overrideName: string = null,
  ): ((format: LibraryFormats) => LibraryOptions) =>
  (format: LibraryFormats) => ({
    name: (overrideName || name).toLowerCase(), // only for umd
    entry: fileURLToPath(
      new URL(
        `./src/${camelCase(name)}/${name}${
          format === "es" ? "App.ts" : ".vue"
        }`,
        import.meta.url,
      ),
    ),
    // as this package is not yet a module, the default would be mjs and cjs which is not what we want
    fileName: (format) => `${name}${format === "es" ? "" : `.${format}`}.js`,
    formats: [format as LibraryFormats],
  });

const libraries: Record<
  ComponentLibraries,
  (format: LibraryFormats) => LibraryOptions
> = {
  NodeDialog: getComponentLibraryOptions("NodeDialog", "defaultdialog"),
  TableView: getComponentLibraryOptions("TableView"),
  DeferredTableView: getComponentLibraryOptions("DeferredTableView"),
  TextView: getComponentLibraryOptions("TextView"),
  FlowVariableView: getComponentLibraryOptions("FlowVariableView"),
  ImageView: getComponentLibraryOptions("ImageView"),
};

const getCurrentLibrary = (
  mode: ComponentLibraries,
  format: LibraryFormats,
) => {
  if (mode in libraries) {
    return libraries[mode](format);
  }

  return false;
};

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

// https://vitest.dev/config/
export default defineConfig((userOptions) => {
  const [mode = "", format = "es"] = userOptions?.mode?.split(":") ?? [];
  const env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  const testMode = mode === "integration" ? "integration" : "unit";

  const conditionalVitePlugins = [];
  const conditionalRollupOptions = { external: [], output: {} };

  if (format === "umd") {
    conditionalVitePlugins.push(
      cssInjectedByJsPlugin({
        injectCodeFunction: function injectCodeFunction(cssCode: string) {
          try {
            if (typeof document !== "undefined") {
              const elementStyle = document.createElement("style");
              elementStyle.appendChild(document.createTextNode(cssCode));
              document.head.prepend(elementStyle);
            }
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error("vite-plugin-css-injected-by-js", e);
          }
        },
      }),
    );

    conditionalRollupOptions.external = ["vue"];
    conditionalRollupOptions.output = {
      globals: {
        vue: "Vue",
      },
    };
  }

  return {
    define: {
      "process.env": env, // needed by v-calendar
    },
    plugins: [vue(), svgLoader(), ...conditionalVitePlugins].filter(Boolean),
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
      lib: getCurrentLibrary(
        mode as ComponentLibraries,
        format as LibraryFormats,
      ),
      emptyOutDir: false,
      cssCodeSplit: false,
      rollupOptions: {
        ...conditionalRollupOptions,
        ...{
          plugins: [
            {
              apply: "build",
              enforce: "post",
              name: "macro-replace-css",
              generateBundle(opts, bundle) {
                // we only support this for ES format, umd uses the head injection
                if (opts.format !== "es") {
                  return;
                }
                const bundleKeys = Object.keys(bundle);
                const bundleFilename = bundleKeys.find((name) =>
                  name.endsWith(".js"),
                );
                const cssFilename = bundleKeys.find((name) =>
                  name.endsWith(".css"),
                );

                if (!bundleFilename || !cssFilename) {
                  // eslint-disable-next-line no-console
                  console.log("Do not call macro-replace-css");
                  return;
                }

                const {
                  // @ts-ignore
                  [cssFilename]: { source: rawCss },
                  [bundleFilename]: component,
                } = bundle;

                // @ts-ignore
                component.code = component.code.replace(
                  "__INLINE_CSS_CODE__",
                  JSON.stringify(rawCss),
                );

                // remove css file from final bundle
                delete bundle[cssFilename];
              },
            },
          ],
        },
      },
    },
    test: {
      include: getIncludedTestFiles(testMode),
      exclude: getExcludedTestFiles(testMode),
      environment: "jsdom",
      reporters: ["default", "junit"],
      deps: { inline: ["consola", "@knime/knime-ui-table"] },
      setupFiles: [
        fileURLToPath(new URL(getTestSetupFile(testMode), import.meta.url)),
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
          "**/{vite,vitest,postcss,lint-staged}.config.{js,cjs,mjs,ts}",
          "**/.{eslint,prettier,stylelint}rc.{js,cjs,yml}",
          "**/types/**",
          "**/dev/**",
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
