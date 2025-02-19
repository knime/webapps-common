import vitest from "@vitest/eslint-plugin";
import jestFormatting from "eslint-plugin-jest-formatting";

export default [
  {
    name: "vitest rules",
    files: ["**/__tests__/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],

    plugins: {
      vitest,
      "jest-formatting": jestFormatting,
    },

    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "no-magic-numbers": "off",
      "no-undefined": "off",
      "max-nested-callbacks": "off",
      "vitest/consistent-test-it": "error",
      "vitest/expect-expect": "off",

      "vitest/max-nested-describe": [
        "error",
        {
          max: 3,
        },
      ],

      "vitest/no-conditional-tests": "warn",
      "vitest/no-focused-tests": "error",
      "vitest/no-identical-title": "error",
      "vitest/no-disabled-tests": "warn",

      "vitest/prefer-lowercase-title": [
        "error",
        {
          ignoreTopLevelDescribe: true,
        },
      ],

      "vitest/prefer-to-be": "error",
      "jest-formatting/padding-around-after-all-blocks": "error",
      "jest-formatting/padding-around-after-each-blocks": "error",
      "jest-formatting/padding-around-before-all-blocks": "error",
      "jest-formatting/padding-around-before-each-blocks": "error",
      "jest-formatting/padding-around-describe-blocks": "error",
      "jest-formatting/padding-around-test-blocks": "error",
      "jest-formatting/padding-around-expect-groups": "off",
    },
  },
];
