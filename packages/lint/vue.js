const parentRules = require("./base").rules;

module.exports = {
  plugins: ["vue", "import"],
  extends: [
    "./base.js",
    "plugin:vue/recommended",
    "./prettierOverwrites-vue.js",
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
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
};
