import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";
import type { LibraryOptions } from "vite";
import { loadEnv } from "vite";
// @ts-ignore
import { svgoConfig } from "@knime/styles/config/svgo.config";

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
): LibraryOptions => ({
  entry: fileURLToPath(
    new URL(`./src/${camelCase(name)}/${name}App.ts`, import.meta.url),
  ),
  fileName: name,
  formats: ["es"],
});

const libraries: Record<ComponentLibraries, LibraryOptions> = {
  NodeDialog: getComponentLibraryOptions("NodeDialog"),
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

const htmlModePrefix = "html:";
const getHtmlViewRollupOptions = (mode: string) => ({
  input: fileURLToPath(
    new URL(`./${mode.replace(htmlModePrefix, "")}.html`, import.meta.url),
  ),
});

// https://vitest.dev/config/
export default defineConfig(({ mode }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  const testMode = mode === "integration" ? "integration" : "unit";

  const conditionalRollupOptions = { external: [], output: {} };

  return {
    define: {
      "process.env": env, // needed by v-calendar
    },
    plugins: [vue(), svgLoader({ svgoConfig })],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "@@": fileURLToPath(new URL(".", import.meta.url)),
      },
    },
    build: {
      lib: getCurrentLibrary(mode as ComponentLibraries),
      emptyOutDir: false,
      cssCodeSplit: false,
      rollupOptions: mode.startsWith(htmlModePrefix)
        ? getHtmlViewRollupOptions(mode)
        : {
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
                    const bundleFilename = bundleKeys.filter((name) =>
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

                    bundleFilename.forEach((file) => {
                      const {
                        // @ts-ignore
                        [cssFilename]: { source: rawCss },
                        [file]: component,
                      } = bundle;

                      // @ts-ignore
                      component.code = component.code.replace(
                        "__INLINE_CSS_CODE__",
                        JSON.stringify(rawCss),
                      );
                    });
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
        reportsDirectory: `coverage/${testMode}`,
      },
      outputFile: {
        junit: "test-results/junit.xml", // needed for Bitbucket Pipeline, see https://support.atlassian.com/bitbucket-cloud/docs/test-reporting-in-pipelines/
      },
    },
    envPrefix: "KNIME_",
  };
});
