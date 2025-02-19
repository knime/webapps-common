import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import globals from "globals";

import baseConfig from "./base.js";

export default [
  // extend baseConfig files to include ts files
  ...baseConfig.map((config) => {
    if (config.name?.includes("@knime/eslint-config/base")) {
      return {
        ...config,
        files: [...config.files, "**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
      };
    }
    return config;
  }),
  {
    name: "@knime/eslint-config/typescript",
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
