// This is a workaround for https://github.com/eslint/eslint/issues/3458
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  extends: ["@knime/eslint-config/typescript", "@knime/eslint-config/vitest"],
  env: {
    node: true,
    browser: true,
  },
  settings: {
    "import/resolver": {
      alias: {
        map: [["@", "src/."]],
      },
    },
  },
};
