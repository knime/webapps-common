# @knime/eslint-config

## 8.1.0

### Minor Changes

- ece1bed: BREAKING CHANGE: Switch to eslint-import-resolver-custom-alias
  This resolves problems with eslint imports and ESM.

  Adapt your eslint config from

  ```js
  settings: {
    "import/resolver": {
      alias: {
        map: [
          ["@", "./src"],
        ],
      },
    },
  }
  ```

  to

  ```js
  settings: {
    "import/resolver": {
      "eslint-import-resolver-custom-alias": {
        alias: {
          "@": "./src",
        },
      },
    },
  }
  ```
