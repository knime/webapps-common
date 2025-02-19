/* eslint-disable @typescript-eslint/no-require-imports */

const knimeVue3TS = require("@knime/eslint-config/vue3-typescript");

module.exports = [
  ...knimeVue3TS,
  {
    languageOptions: {
      globals: {
        consola: true,
        window: true,
      },
    },

    settings: {
      "import/resolver": {
        "eslint-import-resolver-custom-alias": {
          alias: {
            "@": "./src",
            "@@": ".",
          },
        },
      },
    },
  },
];
