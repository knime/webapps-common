import prettierConfig from "eslint-config-prettier";

// this file always needs to be behind the config to overwrite
// ex: if configs before and including someConfigObj need to be overwritten:
// [..., someConfigObj, ...prettierOverwrites, {// other custom configuration}, ...]
export default [
  prettierConfig, // this disables all formatting rules
  {
    name: "@knime/eslint-config/prettierOverwrites",
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
