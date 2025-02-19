import vuePlugin from "eslint-plugin-vue";

import prettierOverwrite from "./prettierOverwrites.js";

// this file always needs to be the last in
// extends: [..., ..., "./prettierOverwrites-vue.js"]
export default [
  ...prettierOverwrite, // this disables all formatting rules

  // but we want to use a few special rules, see https://github.com/prettier/eslint-config-prettier#special-rules
  {
    name: "prettier overwrite - vue",
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
