import globals from "globals";

import baseConfig from "./base.js";

export default [
  ...baseConfig,
  {
    name: "@knime/eslint-config/eslint-config",
    files: ["*.js"],
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
