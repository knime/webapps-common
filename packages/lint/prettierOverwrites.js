const prettierConfig = require("eslint-config-prettier");

// this file always needs to be the last in
// extends: [..., ..., "./prettierOverwrites.js"]
module.exports = [
  prettierConfig, // this disables all formatting rules
  {
    name: "prettier overwrite",
    // but we want to use a few special rules, see https://github.com/prettier/eslint-config-prettier#special-rules
    rules: {
      // see https://github.com/prettier/eslint-config-prettier/#curly
      curly: "error",

      // make sure backticks are only used when needed
      // see https://github.com/prettier/eslint-config-prettier/#quotes
      quotes: [
        "warn",
        "double",
        {
          avoidEscape: true,
          allowTemplateLiterals: false,
        },
      ],
    },
  },
];
