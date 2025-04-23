import path from "node:path";
import { fileURLToPath } from "node:url";

import globals from "globals";

import knimeVitest from "@knime/eslint-config/vitest.js";
import createKnimeVueTSConfig from "@knime/eslint-config/vue3-typescript.js";

// get absolute path to tsconfig so that ide and cli both work
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tsconfigPath = path.resolve(__dirname, "tsconfig.eslint.json");

export default [
  {
    ignores: ["demo/*"],
  },
  ...createKnimeVueTSConfig(tsconfigPath),
  ...knimeVitest,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        consola: true,
      },
    },
  },
  {
    files: ["packages/lint/**/*.js"],
    languageOptions: {
      globals: {
        ...Object.fromEntries(
          Object.entries(globals.browser).map(([key]) => [key, "off"]),
        ),
        ...globals.node,
      },
    },
    rules: {
      "no-magic-numbers": "off",
    },
  },
];
