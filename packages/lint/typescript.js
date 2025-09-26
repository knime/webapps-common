import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import globals from "globals";

import baseConfig from "./base.js";

const createTSConfig = (tsconfigPath) => {
  const config = [
    // extend baseConfig files to include ts files
    ...baseConfig.map((config) => {
      if (config.name && config.name === "@knime/eslint-config/base") {
        return {
          ...config,
          files: [
            ...config.files,
            "**/*.ts",
            "**/*.tsx",
            "**/*.mts",
            "**/*.cts",
          ],
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

        "no-use-before-define": "off",
        "@typescript-eslint/no-use-before-define": "error",
      },
    },
  ];
  if (tsconfigPath) {
    config.push({
      name: "@knime/eslint-config/typescript-typed",
      files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
      languageOptions: {
        parser: tsParser,
        parserOptions: {
          project: tsconfigPath,
        },
      },
      rules: {
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/no-misused-promises": "error",
      },
    });
  }
  return config;
};

export default createTSConfig;
