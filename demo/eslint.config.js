import knimeVue3TS from "@knime/eslint-config/vue3-typescript";

export default [
  ...knimeVue3TS,
  {
    languageOptions: {
      globals: {
        consola: true,
        window: true,
      },
    },

    settings: {
      "import-x/resolver": {
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
