import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import postcss from "postcss";
import dts from "vite-plugin-dts";
import svgLoader from "vite-svg-loader";

import { svgoConfig } from "@knime/styles/config/svgo.config";

export default defineConfig({
  plugins: [
    vue(),
    svgLoader({ svgoConfig }),
    dts({
      insertTypesEntry: true,
      tsconfigPath: "tsconfig.app.json",
    }),
  ],
  css: { postcss },
  build: {
    lib: {
      entry: {
        "knime-jsonforms": "src/index.ts",
        testing: "testUtils/index.ts",
      },
      name: "KNIME JSON Forms integration",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith(".css")) {
            return "knime-jsonforms.css";
          }
          return assetInfo.name;
        },
      },
    },
  },
});
