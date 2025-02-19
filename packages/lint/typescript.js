const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const globals = require("globals");

const baseConfig = require("./base.js");
const prettierOverrides = require("./prettierOverwrites.js");

module.exports = [
  ...baseConfig,
  ...prettierOverrides,
  {
    name: "typescript rules",
    files: ["**/*.ts"],
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },
    languageOptions: {
      globals: {
        // TODO: Consider removing this setting when this typescript configuration
        // is used on projects that are not necessarily node or browser
        ...globals.browser,
        ...globals.node,
      },

      parser: tsParser,
    },
    rules: {
      "no-duplicate-imports": "off",
      "import/no-duplicates": "error",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "prefer-const": "error",
    },
  },
];
