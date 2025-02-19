const globals = require("globals");

const baseConfig = require("./base.js");

module.exports = [
  ...baseConfig,
  {
    name: "root-lint",
    files: ["**/*.js"],
    languageOptions: {
      globals: {
        ...Object.fromEntries(
          Object.entries(globals.browser).map(([key]) => [key, "off"]),
        ),
        ...globals.node,
      },
    },
    rules: {
      "no-magic-numbers": "off",
    },
  },
];
