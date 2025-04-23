import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from "@vue/eslint-config-typescript";
import tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import-x";
import vueParser from "vue-eslint-parser";

import prettierOverridesVue from "./prettierOverwrites-vue.js";
import knimeTS from "./typescript.js";
import vue3Config from "./vue3.js";

const createKnimeVueTSConfig = (tsconfigPath) => {
  // uses a utility function to modify given ESLint configs to work with Vue.js + Typescript
  const config = defineConfigWithVueTs(
    // extend baseconfig to also apply to ts files
    ...vue3Config.map((config) => {
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
    vueTsConfigs.recommended,
    ...prettierOverridesVue,
    {
      name: "@knime/eslint-config/vue3-typescript-extension",
      files: [
        "**/*.js",
        "**/*.jsx",
        "**/*.cjs",
        "**/*.mjs",
        "**/*.vue",
        "**/*.ts",
        "**/*.tsx",
        "**/*.mts",
        "**/*.cts",
      ],
      plugins: {
        import: importPlugin,
      },
      rules: {
        "@typescript-eslint/no-unused-vars": [
          // allow unused vars if their name starts with _
          "error",
          {
            argsIgnorePattern: "^_",
            caughtErrorsIgnorePattern: "^_",
            destructuredArrayIgnorePattern: "^_",
            varsIgnorePattern: "^_",
          },
        ],
        // explicitly turn off base rule which is extended by @typescript-eslint/no-unused-vars
        "import/no-duplicates": "error",
        "no-duplicate-imports": "off",
        "unused-imports/no-unused-vars": "off",

        "vue/block-lang": [
          "error",
          {
            script: {
              lang: "ts",
            },
          },
        ],
      },
    },
    {
      // disable ts rules for package.json
      files: ["package.json"],
      rules: {
        "@typescript-eslint/no-unused-expressions": "off",
      },
    },
  );
  if (tsconfigPath) {
    config.push(
      ...knimeTS(tsconfigPath).filter(
        (config) =>
          config.name &&
          config.name === "@knime/eslint-config/typescript-typed",
      ),
      {
        name: "@knime/eslint-config/vue3-typescript-typed-vue",
        files: ["**/*.vue"],
        languageOptions: {
          parser: vueParser,
          parserOptions: {
            parser: tsParser,
            project: tsconfigPath,
            extraFileExtensions: [".vue"],
          },
        },
        rules: {
          "@typescript-eslint/no-floating-promises": "error",
          "@typescript-eslint/no-misused-promises": "error",
        },
      },
    );
  }
  return config;
};

export default createKnimeVueTSConfig;
