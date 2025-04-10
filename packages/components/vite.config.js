import { defineConfig } from "vite";
import vuePlugin from "@vitejs/plugin-vue";
import postcss from "postcss";
import dts from "vite-plugin-dts";
import svgLoader from "vite-svg-loader";

export default defineConfig({
  plugins: [
    vuePlugin(),
    svgLoader(),
    dts({
      insertTypesEntry: true,
      tsconfigPath: "tsconfig.app.json",
    }),
  ],
  css: { postcss },
  build: {
    lib: {
      entry: {
        "knime-components": "src/index.ts",
      },
      name: "KNIME Components",
      formats: ["es"],
    },
    outDir: "dist",
    sourceMap: true,
    cssCodeSplit: true,
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});
