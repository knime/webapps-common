// this file always needs to be the last in
// extends: [..., ..., "./prettierOverwrites-vue.js"]
module.exports = {
  extends: ["./prettierOverwrites.js"], // this disables all formatting rules

  // but we want to use a few special rules, see https://github.com/prettier/eslint-config-prettier#special-rules
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
};
