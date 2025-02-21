import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/__tests__/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    environment: "jsdom",
    root: fileURLToPath(new URL("./", import.meta.url)),
  },
});
