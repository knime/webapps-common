import { fileURLToPath } from "url";

import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { defineProject } from "vitest/config";
import svgLoader from "vite-svg-loader";

import { svgoConfig } from "@knime/styles/config/svgo.config";

export default defineProject({
  plugins: [vue(), vueJsx(), svgLoader({ svgoConfig })],
  test: {
    environment: "jsdom",
    setupFiles: [fileURLToPath(new URL("vitest.setup.ts", import.meta.url))],
  },
});
