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
      tsconfigPath: "tsconfig.app.json",
    }),
  ],
  build: {
    lib: {
      entry: {
        "knime-jsonforms": "src/index.ts",
        testing: "testUtils/index.ts",
      },
      name: "KNIME JSONForms integration",
      formats: ["es"],
    },
    rolldownOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
        assetFileNames: (assetInfo) => {
          const name = assetInfo.names?.[0];
          if (name?.endsWith(".css")) {
            return "knime-jsonforms.css";
          }
          return name ?? "[name][extname]";
        },
      },
    },
  },
});
