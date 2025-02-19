const vuePlugin = require("eslint-plugin-vue");

const parentRules = require("./base").rules;
const baseConfig = require("./base");
const prettierOverridesVue = require("./prettierOverwrites-vue");

module.exports = [
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
        Object.assign(parentRules["max-lines"][1], {
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
      "import/resolver": {
        "eslint-import-resolver-custom-alias": {
          extensions: [".js", ".mjs", ".config.js", ".vue", ".json", ".svg"],
        },
      },
    },
  },
];
