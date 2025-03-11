import vitest from "@vitest/eslint-plugin";

import tempDisable from "./temporary-disable.js";

export default [
  {
    name: "@knime/eslint-config/vitest",
    files: ["**/__tests__/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],

    plugins: {
      vitest,
    },

    rules: {
      ...vitest.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "off",
      "no-magic-numbers": "off",
      "no-undefined": "off",
      "max-nested-callbacks": "off",
      "vitest/consistent-test-it": "error",
      "vitest/expect-expect": [
        "error",
        { assertFunctionNames: ["expect*", "assert*"] },
      ],

      "vitest/max-nested-describe": [
        "error",
        {
          max: 3,
        },
      ],

      "vitest/no-conditional-tests": "warn",
      "vitest/no-focused-tests": "error",
      "vitest/no-disabled-tests": "warn",

      "vitest/prefer-lowercase-title": [
        "error",
        {
          ignoreTopLevelDescribe: true,
        },
      ],

      "vitest/prefer-to-be": "error",
      "vitest/padding-around-after-all-blocks": "error",
      "vitest/padding-around-after-each-blocks": "error",
      "vitest/padding-around-before-all-blocks": "error",
      "vitest/padding-around-before-each-blocks": "error",
      "vitest/padding-around-describe-blocks": "error",
      "vitest/padding-around-test-blocks": "error",
      "vitest/padding-around-expect-groups": "off",
    },
  },
  ...tempDisable,
];
