const prettierConfig = require("eslint-config-prettier");
const vuePlugin = require("eslint-plugin-vue");

const baseConfig = require("./base.js");
const prettierOverridesVue = require("./prettierOverwrites-vue.js");

module.exports = [
  ...baseConfig,
  {
    name: "plugin-vue (vue3js)",
    plugins: {
      vue: vuePlugin,
    },
  },
  ...vuePlugin.configs["flat/strongly-recommended"], // plugin:vue/vue3-recommended

  prettierConfig,
  ...prettierOverridesVue,
  {
    name: "vue3js additional configs",
    plugins: {
      vue: vuePlugin,
    },

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    settings: {
      "import/resolver": {
        "eslint-import-resolver-custom-alias": {
          extensions: [".js", ".mjs", ".config.js", ".vue", ".json", ".svg"],
        },
      },
    },

    rules: {
      "import/extensions": [
        "error",
        {
          vue: "always",
          json: "always",
          mjs: "always",
          svg: "always",
          config: "ignorePackages",
        },
      ],

      "vue/multi-word-component-names": "off", // TODO enable?
      "vue/no-reserved-component-names": "off", // TODO enable?
      "vue/padding-line-between-blocks": "error",
      "vue/require-v-for-key": "warn",
      "vue/v-slot-style": ["error", "shorthand"],
    },
  },
];
