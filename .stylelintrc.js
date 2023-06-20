module.exports = {
  extends: ["@knime/eslint-config/stylelint/vue"],
  rules: {
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: ["define-mixin", "mixin"],
      },
    ],
  },
};
