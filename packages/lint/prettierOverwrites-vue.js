import vuePlugin from "eslint-plugin-vue";

import prettierOverwrite from "./prettierOverwrites.js";

// this file always needs to be behind the config to overwrite
// ex: if configs before and including someConfigObj need to be overwritten:
// [..., someConfigObj, ...prettierOverwritesVue, {// other custom configuration}, ...]
export default [
  ...prettierOverwrite, // this disables all formatting rules

  // but we want to use a few special rules, see https://github.com/prettier/eslint-config-prettier#special-rules
  {
    name: "@knime/eslint-config/prettierOverwrites-vue",
    plugins: {
      vue: vuePlugin,
    },
    rules: {
      // see https://github.com/prettier/eslint-config-prettier/#vuehtml-self-closing
      "vue/html-self-closing": [
        "error",
        {
          html: {
            void: "any",
          },
        },
      ],
    },
  },
];
