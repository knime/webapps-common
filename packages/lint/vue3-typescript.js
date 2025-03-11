import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from "@vue/eslint-config-typescript";
import importPlugin from "eslint-plugin-import-x";

import prettierOverridesVue from "./prettierOverwrites-vue.js";
import tempDisable from "./temporary-disable.js";
import vue3Config from "./vue3.js";

// uses a utility function to modify given ESLint configs to work with Vue.js + Typescript
export default defineConfigWithVueTs({
  // extend baseconfig to also apply to ts files
  extends: [
    ...vue3Config.map((config) => {
      if (config.name?.includes("@knime/eslint-config/base")) {
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
    ...tempDisable,
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
      "warn",
      {
        script: {
          lang: "ts",
        },
      },
    ],
  },
});
