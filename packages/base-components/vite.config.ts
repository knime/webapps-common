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
