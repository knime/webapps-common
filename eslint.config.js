import globals from "globals";

import knimeVitest from "@knime/eslint-config/vitest.js";
import knimeVue3TS from "@knime/eslint-config/vue3-typescript.js";

// needs dependency @typescript-eslint/utils in package.json to properly resolve type
export default [
  {
    ignores: ["demo/*", "**/check-pnpm.js", "**/dist/*"],
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
  // eslint config uses esm style which requires file extensions and can't easily be reconfigured in the node environment
  {
    files: ["packages/lint/*", "eslint.config.{js,mjs}"],
    rules: {
      "import/extensions": "off",
    },
  },
];
