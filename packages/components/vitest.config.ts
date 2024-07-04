import { defineProject } from "vitest/config";
import { fileURLToPath } from "url";
import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";

// @ts-ignore
import { svgoConfig } from "@knime/styles/config/svgo.config";

export default defineProject({
  plugins: [vue(), svgLoader({ svgoConfig })],
  test: {
    environment: "jsdom",
    setupFiles: [fileURLToPath(new URL("vitest.setup.ts", import.meta.url))],
  },
});
