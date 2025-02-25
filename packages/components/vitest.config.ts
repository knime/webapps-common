import path from "path";
import { fileURLToPath } from "url";

import vue from "@vitejs/plugin-vue";
import { defineProject } from "vitest/config";
import svgLoader from "vite-svg-loader";

import { svgoConfig } from "@knime/styles/config/svgo.config";

export default defineProject({
  plugins: [vue(), svgLoader({ svgoConfig })],
  test: {
    environment: "jsdom",
    setupFiles: [fileURLToPath(new URL("vitest.setup.ts", import.meta.url))],
    alias: [
      {
        find: "v-calendar",
        replacement: "v-calendar",
        customResolver: {
          resolveId: (source) =>
            source === "v-calendar"
              ? path.resolve(
                  __dirname,
                  "node_modules/v-calendar/dist/es/index.js",
                )
              : null,
        },
      },
    ],
  },
});
