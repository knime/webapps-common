import knimeVue3TS from "./vue3-typescript.js";

export default [
  ...knimeVue3TS,
  {
    name: "@knime/eslint-config/vue3-typescript-strict",
    rules: {
      "vue/block-lang": [
        "error",
        {
          script: {
            lang: "ts",
          },
        },
      ],
    },
  },
];
