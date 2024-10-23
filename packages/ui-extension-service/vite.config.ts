import { URL, fileURLToPath } from "node:url";

import {
  BuildOptions,
  LibraryFormats,
  PluginOption,
  TerserOptions,
  defineConfig,
} from "vite";
import dts from "vite-plugin-dts";

const LibraryBuilds = ["es", "iifeMin", "iifeDev"] as const;

type LibraryBuildTypes = (typeof LibraryBuilds)[number];

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
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("src/.", import.meta.url)),
      },
    },
    build: {
      lib: {
        entry: fileURLToPath(new URL("src/index.ts", import.meta.url)),
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
