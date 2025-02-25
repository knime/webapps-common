import { URL, fileURLToPath } from "node:url";

import {
  type BuildOptions,
  type LibraryFormats,
  type PluginOption,
  type TerserOptions,
  defineConfig,
} from "vite";
import dts from "vite-plugin-dts";

const _LibraryBuilds = ["es", "iifeMin", "iifeDev"] as const;

type LibraryBuildTypes = (typeof _LibraryBuilds)[number];

const terserOptions: Record<LibraryBuildTypes, TerserOptions> = {
  es: {},
  iifeMin: {
    keep_classnames: true,
    keep_fnames: true,
  },
  iifeDev: {
    mangle: false,
    format: {
      comments: "all",
    },
  },
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const formats: LibraryFormats[] = [];
  const buildOptions: BuildOptions = {};
  const plugins: PluginOption[] = [];
  if (mode === "es") {
    formats.push("es");
    plugins.push(
      dts({
        rollupTypes: true,
        copyDtsFiles: true,
        tsconfigPath: "tsconfig.app.json",
      }),
    );
  } else {
    formats.push("iife");
    buildOptions.minify = "terser";
    buildOptions.terserOptions = terserOptions[mode as LibraryBuildTypes];
  }

  return {
    plugins,
    build: {
      lib: {
        entry: {
          index: fileURLToPath(new URL("src/index.ts", import.meta.url)),
          ...(mode === "es"
            ? {
                internal: fileURLToPath(
                  new URL("src/internal/index.ts", import.meta.url),
                ),
              }
            : {}),
        },
        name: "KnimeUIExtensionService",
        fileName: () => {
          return mode === "es"
            ? "index.js"
            : `knime-ui-extension-service.${mode.substring(4).toLowerCase()}.js`;
        },
        formats,
      },
      emptyOutDir: false,
      ...buildOptions,
    },
  };
});
