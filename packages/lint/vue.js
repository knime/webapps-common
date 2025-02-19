import vuePlugin from "eslint-plugin-vue";

import baseConfig from "./base.js";
import prettierOverridesVue from "./prettierOverwrites-vue.js";

export default [
  ...baseConfig,
  {
    name: "plugin-vue vuejs",
    plugins: {
      vue: vuePlugin,
    },
  },
  ...vuePlugin.configs["flat/vue2-recommended"], // plugin:vue/recommended
  ...prettierOverridesVue,
  {
    name: "vuejs additional rules",
    plugins: {
      vue: vuePlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      "max-lines": [
        "warn",
        Object.assign(baseConfig.rules["max-lines"][1], {
          max: 500,
        }),
      ],
      "vue/multi-word-component-names": "off",
      "vue/no-reserved-component-names": "off",
      "vue/padding-line-between-blocks": "error",
      "vue/require-v-for-key": "warn",
      "import/extensions": [
        "error",
        { vue: "always", json: "always", mjs: "always", svg: "always" },
      ],
    },
    settings: {
      "import-x/resolver": {
        "eslint-import-resolver-custom-alias": {
          extensions: [".js", ".mjs", ".config.js", ".vue", ".json", ".svg"],
        },
      },
    },
  },
];
