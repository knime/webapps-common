module.exports = {
  overrides: [
    {
      extends: ["./base.js", "prettier"],
      files: ["**/*.ts"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint", "import"],
      rules: {
        "no-duplicate-imports": "off",
        "import/no-duplicates": "error",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "prefer-const": "error",
      },
      // TODO: Consider removing this setting when this typescript configuration
      // is used on projects that are not necessarily node or browser
      env: { browser: true, node: true },
    },
  ],
};
