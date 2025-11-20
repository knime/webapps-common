module.exports = {
  extends: ["@knime/eslint-config/stylelint/vue"],

  rules: {
    "csstools/value-no-unknown-custom-properties": [
      true,
      {
        importFrom: [
          "packages/styles/css/variables/index.css",
          "packages/components/src/components/forms/variables.css",
          "packages/jsonforms/src/higherOrderComponents/control/errorMessage/error-messages.css",
        ],
      },
    ],
  },

  overrides: [
    {
      files: ["demo/**/*.{css,scss,vue}"],
      rules: {
        "no-invalid-position-declaration": null,
      },
    },
  ],
};
