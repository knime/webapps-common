import eslint from "@eslint/js";
import importPlugin from "eslint-plugin-import-x";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";

import prettierOverrides from "./prettierOverwrites.js";

const maxLines = 500;

let languageOptions = {
  ecmaVersion: "latest",
  sourceType: "module",
};

export default [
  eslint.configs.recommended, // eslint:recommended
  ...prettierOverrides,
  {
    name: "@knime/eslint-config/global-ignores",
    ignores: [
      "**/coverage/",
      "**/test-results/",
      "**/dist/",
      "**/target/",
      "**/*env.d.ts",
      "**/.pnpm-store/*",
    ],
  },
  {
    name: "@knime/eslint-config/base",
    files: ["**/*.js", "**/*.jsx", "**/*.cjs", "**/*.mjs"],
    plugins: {
      "unused-imports": unusedImports,
      import: importPlugin,
    },
    languageOptions: {
      ...languageOptions,
      globals: {
        ...Object.fromEntries(
          Object.entries(globals.browser).map(([key]) => [key, "off"]),
        ),
        ...globals.es2015, // es6
      },
    },
    rules: {
      "accessor-pairs": "warn",
      "array-callback-return": "error",
      "block-scoped-var": "error",
      camelcase: "error",
      "class-methods-use-this": "warn",
      complexity: "warn",
      "consistent-return": "warn",
      "consistent-this": ["warn", "self"],
      "dot-notation": ["warn"],
      eqeqeq: "error",
      "func-name-matching": "warn",
      "func-style": "warn",
      "handle-callback-err": ["warn", "^err(or)?$"],
      "lines-between-class-members": [
        "warn",
        "always",
        { exceptAfterSingleLine: true },
      ],
      "max-depth": "warn",
      "max-lines": [
        "warn",
        {
          max: maxLines,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      "max-nested-callbacks": ["warn", 4],
      "max-params": ["warn", 4],
      "max-statements-per-line": ["warn", { max: 2 }],
      "new-cap": "warn",
      "no-array-constructor": "warn",
      "no-async-promise-executor": "off",
      "no-bitwise": "warn",
      "no-buffer-constructor": "error",
      "no-console": "error",
      "no-duplicate-imports": "error",
      "no-empty-function": ["error", { allow: ["arrowFunctions"] }],
      "no-extend-native": "warn",
      "no-extra-boolean-cast": "warn",
      "no-extra-label": "error",
      "no-implicit-coercion": "warn",
      "no-implied-eval": "error",
      "no-invalid-this": "warn",
      "no-iterator": "error",
      "no-lone-blocks": "warn",
      "no-lonely-if": "warn",
      "no-magic-numbers": [
        "warn",
        {
          ignore: [-1, 0, 1, 2, 100, 1000],
          ignoreArrayIndexes: true,
          enforceConst: true,
        },
      ],
      "no-misleading-character-class": "off",
      "no-negated-condition": "error",
      "no-nested-ternary": "warn",
      "no-new-func": "warn",
      "no-new-object": "error",
      "no-new-require": "error",
      "no-new-wrappers": "error",
      "no-path-concat": "warn",
      "no-process-env": "error",
      "no-process-exit": "warn",
      "no-proto": "error",
      "no-prototype-builtins": "off",
      "no-restricted-globals": ["error", "event", "fdescribe"],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["lodash*", "!lodash-es"],
              message:
                "Please try using native functions (see https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore). If lodash is really needed, use 'lodash-es' package.",
            },
          ],
        },
      ],
      "no-restricted-syntax": ["warn", "WithStatement", "SequenceExpression"],
      "no-return-assign": "error",
      "no-return-await": "error",
      "no-self-compare": "error",
      "no-sequences": "error",
      "no-shadow-restricted-names": "error",
      "no-tabs": "error",
      "no-template-curly-in-string": "warn",
      "no-throw-literal": "warn",
      "no-undef-init": "error",
      "no-undefined": "error",
      "no-unmodified-loop-condition": "warn",
      "no-unneeded-ternary": "error",
      "no-unused-expressions": "warn",
      "no-use-before-define": "error",
      "no-useless-call": "warn",
      "no-useless-catch": "off",
      "no-useless-computed-key": "error",
      "no-useless-concat": "warn",
      "no-useless-constructor": "error",
      "no-useless-rename": "error",
      "no-useless-return": "warn",
      "no-var": "error",
      "no-void": "warn",
      "no-warning-comments": "warn",
      "no-with": "warn",
      "object-shorthand": "warn",
      "one-var": [
        "error",
        {
          initialized: "never",
          uninitialized: "consecutive",
        },
      ],
      "operator-assignment": "warn",
      "prefer-promise-reject-errors": "warn",
      "prefer-rest-params": "warn",
      "prefer-spread": "warn",
      "prefer-template": "error",
      radix: "error",
      "require-atomic-updates": "off",
      "require-await": "error",
      "spaced-comment": [
        "warn",
        "always",
        {
          block: {
            markers: ["/", "*", "!"],
            balanced: true,
          },
        },
      ],
      yoda: ["error", "never", { exceptRange: true }],

      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "import/newline-after-import": "error",
      // Force imports to be grouped and sorted alphabetically
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            ["index", "sibling"],
          ],
          pathGroups: [
            {
              pattern: "*(@)+(vue|vueuse|nuxt|vite|vitejs|vitest|#*)", // # used in Nuxt
              group: "external",
              position: "before",
            },
            {
              pattern: "*(@)+(vue|vueuse|nuxt|vite|vitejs|vitest|#*)/**",
              group: "external",
              position: "before",
            },
            {
              pattern: "@knime/**",
              group: "internal",
              position: "before",
            },
            {
              pattern: "@@/**",
              group: "parent",
              position: "before",
            },
            {
              pattern: "+(@|~)/**",
              group: "parent",
              position: "before",
            },
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
          },
          pathGroupsExcludedImportTypes: ["builtin"],
          distinctGroup: false,
        },
      ],
      // Force named imports to be sorted alphabetically
      "sort-imports": [
        "error",
        {
          ignoreDeclarationSort: true, // prevents conflict with import/order
        },
      ],
    },
  },
  // overrrides
  {
    name: "@knime/eslint-config/base-configfiles",
    files: [
      "**/config.{js,ts,mjs,cjs}",
      "**/*.config.{js,ts,mjs,cjs}",
      "**/config/**",
    ],
    rules: {
      camelcase: "off",
      "no-magic-numbers": "off",
      "no-process-env": "off",
    },
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  // eslint config uses esm style which requires file extensions and can't easily be reconfigured in the node environment
  {
    name: "@knime/eslint-config/base-eslint-config-import-extensions",
    files: ["eslint.config.{js,mjs}"],
    rules: {
      "import/extensions": "off",
    },
  },
];
