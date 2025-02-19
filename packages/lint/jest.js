const jest = require("eslint-plugin-jest");
const jestFormatting = require("eslint-plugin-jest-formatting");
const globals = require("globals");

module.exports = [
  {
    name: "jest config",
    files: ["**/*.js", "**/*.ts"],

    plugins: {
      jest,
      "jest-formatting": jestFormatting,
    },

    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
      },
    },

    rules: {
      "jest-formatting/padding-around-after-all-blocks": "error",
      "jest-formatting/padding-around-after-each-blocks": "error",
      "jest-formatting/padding-around-before-all-blocks": "error",
      "jest-formatting/padding-around-before-each-blocks": "error",
      "jest-formatting/padding-around-describe-blocks": "error",
      "jest-formatting/padding-around-test-blocks": "error",
      "no-undefined": "off",
    },
  },
];
