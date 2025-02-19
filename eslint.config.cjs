/* eslint-disable @typescript-eslint/no-require-imports */

const globals = require("globals");

const knimeVitest = require("@knime/eslint-config/vitest");
const knimeVue3TS = require("@knime/eslint-config/vue3-typescript");

module.exports = [
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
];
