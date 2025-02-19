/*
 * rules that should temporarily be disabled for version 9.0.0 to make the switch to eslint 9 easier
 * this includes rules that are not autofixable and would require some more effort to fix
 */

export default [
  {
    name: "temporary disable",
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "prefer-const": "off",
      // knime-hub-webapp not autofixable rules
      // added by nuxt config
      "@typescript-eslint/no-dynamic-delete": "off",
      "no-undef": "off",
      "no-constant-binary-expression": "off",
      "no-prototype-builtins": "off",
      "import/no-mutable-exports": "off",
      "@typescript-eslint/no-extraneous-class": "off",
    },
  },
];
