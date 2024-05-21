import { fileURLToPath, URL } from "node:url";
import {
  BuildOptions,
  defineConfig,
  LibraryFormats,
  TerserOptions,
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
  if (mode === "es") {
    formats.push("es");
  } else {
    formats.push("iife");
    buildOptions.minify = "terser";
    buildOptions.terserOptions = terserOptions[mode as LibraryBuildTypes];
  }

  return {
    plugins: [
      dts({
        rollupTypes: mode === "es",
        copyDtsFiles: mode === "es",
        tsconfigPath: "tsconfig.app.json",
      }),
    ],
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
      ...buildOptions,
    },
  };
});
