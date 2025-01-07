import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import svgLoader from "vite-svg-loader";

import { svgoConfig } from "@knime/styles/config/svgo.config";

export default defineConfig({
  plugins: [
    vue(),
    svgLoader({ svgoConfig }),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "KNIME JSON Forms integration",
      fileName: "knime-jsonforms",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") {
            return "knime-jsonforms.css";
          }
          return assetInfo.name;
        },
      },
    },
  },
});
