import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";
// @ts-ignore
import { svgoConfig } from "@knime/styles/config/svgo.config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), svgLoader({ svgoConfig })],
  base: "/webapps-common/",
  resolve: {
    alias: {
      "@@source/components": fileURLToPath(
        new URL("../packages/components/src/", import.meta.url),
      ),
      "@@source/rich-text-editor": fileURLToPath(
        new URL("../packages/rte/src/", import.meta.url),
      ),
      "@@source/styles": fileURLToPath(
        new URL("../packages/styles/", import.meta.url),
      ),
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
