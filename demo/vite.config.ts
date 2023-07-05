import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), svgLoader()],
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
