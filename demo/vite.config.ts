import { URL, fileURLToPath } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";

import { svgoConfig } from "@knime/styles/config/svgo.config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), svgLoader({ svgoConfig })],
  base: "/webapps-common/",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@@": fileURLToPath(new URL(".", import.meta.url)),
    },
    dedupe: [
      "vue", // needed for v-calendar to work
    ],
  },
  envPrefix: "KNIME_",
  server: {
    fs: {
      allow: [".."], // Allow serving files from one level up to the project root
    },
  },
});
