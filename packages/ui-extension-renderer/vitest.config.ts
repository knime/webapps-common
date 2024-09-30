import { fileURLToPath } from "url";

import { svgoConfig } from "@knime/styles/config/svgo.config";
import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";
import { defineProject } from "vitest/config";

export default defineProject({
  // @ts-ignore
  plugins: [vue(), svgLoader({ svgoConfig })],
  test: {
    environment: "jsdom",
    setupFiles: [fileURLToPath(new URL("vitest.setup.ts", import.meta.url))],
  },
});
