import globals from "globals";

import knimeVitest from "@knime/eslint-config/vitest.js";
import knimeVue3TS from "@knime/eslint-config/vue3-typescript.js";

export default [
  {
    ignores: ["demo/*"],
  },
  ...knimeVue3TS,
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
    rules: {
      "no-magic-numbers": "off",
    },
  },
];
