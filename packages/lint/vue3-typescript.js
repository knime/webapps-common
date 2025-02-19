import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from "@vue/eslint-config-typescript";
import importPlugin from "eslint-plugin-import-x";

import prettierOverridesVue from "./prettierOverwrites-vue.js";
import vue3Config from "./vue3.js";

// uses a utility function to modify given ESLint configs to work with Vue.js + Typescript
export default defineConfigWithVueTs({
  extends: [vue3Config, vueTsConfigs.recommended, prettierOverridesVue],
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
    "vue/block-lang": "warn",
  },
});
