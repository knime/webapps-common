# @knime/eslint-config

## 8.2.0

### Minor Changes

- 2b0b0ee: auto-sort all imports

## 8.1.1

### Patch Changes

- f0b93ea: Rule to prevent lodash now includes lodash.\* packages and displays a useful error message

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
