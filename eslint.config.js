import globals from "globals";

import knimeVitest from "@knime/eslint-config/vitest.js";
import knimeVue3TS from "@knime/eslint-config/vue3-typescript.js";

export default [
  {
    ignores: ["demo/*", "**/check-pnpm.js", "**/dist/*", "**/.pnpm-store/*"],
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
  // temporarily disable certain rules to be able to push first lint fixes
  // and to be able to go through them one by one by commenting one out
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "prefer-const": "off",
    },
  },
];
