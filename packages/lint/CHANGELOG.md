# @knime/eslint-config

## 9.1.1

### Patch Changes

- 5a3b453: Allow the "is child of" (`.parent-modifier-class &`) selector syntax in Stylelint config.

## 9.1.0

### Minor Changes

- 011ba07: enable typed linting for `typescript`, `vue3-typescript` and `nuxt3` configs
  - path to the tsconfig file which eslint should use needs to be provided in projects `eslint.config.js`, see [README.md](README.md)
  - enable rules `no-floating-promise` and `no-misused-promise`
- update dependencies, e.g. eslint which now supports [suppressions](https://eslint.org/docs/latest/use/suppressions)
- acfc273: linting improvements
  - re-enable default rules which were temporarily disabled in @knime/eslint-config 9.0.x
  - remove `no-undefined` and `func-style` rules
  - add `eslint-plugin-depend` which checks for unwanted (e.g. legacy) dependencies (it checks imports and `package.json`)
  - add `e2e` folder to vitest rules
- 59d7dce: add rule for TODO comments that will only warn if a TODO does not include a ticket id (pattern `TODO: <ticket-id>` or `TODO <ticket-id>`). FIXME comments will now raise an error.

## 9.0.2

### Patch Changes

- ac73e72: Relax ts-expect-error for tests & include test util files

## 9.0.1

### Patch Changes

- 525c7a5: fix config file extension of base config and replace some deprecated rules in the base config

## 9.0.0

### Major Changes

- 649f9b6: update to eslint 9 and migrate eslint configs to flat config format

  - upgrade to eslint 9
  - update dependencies
  - migrate eslint configs to flat config and add names to each config object
  - use `eslint-plugin-import-x` instead of `eslint-plugin-import` (compatibility with nuxt3 ruleset)
  - remove configs for jest, vue2, nuxt2 and the legacy config
  - add `vue3-typescript-strict` config which enforces components to be written in TypeScript

  Using this version will require you to also update to eslint 9.x.x and use the flat config format and write the configs as es modules.
  Extending a config form `@knime/eslint-config` looks something like this then:

  ```js
  import config from "@knime/eslint-config/<config>.js";

  export default [
    ...config,
    {
      // additional config
    },
    // additional configs
  ];
  ```

  If you need to extend the files covered with the base config you will need to do it like this:

  ```js
  ...config.map((conf) => {
      if (conf.name && conf.name === "@knime/eslint-config/<config>") {
        return {
          ...conf,
          files: [...conf.files, "*.ts", "*.tsx", "*.mts", "*.cts", "*.vue"],
        };
      }
      return conf;
    })
  ```

  All config objects we export have a name, so should any other configs need adjustment afterwards they can be found through the name and then be adjusted.
  The config objects are generally named after the config file with the "@knime/eslint-config/" prefix. Exceptions for this are the nuxt and vue-typescript configs as they use special helper functions to assemble the config that we couldn't pass a name to.

## 8.3.0

### Minor Changes

- 0aa268c: update stylelint dependency
- 1f2459e: update node version to node 22.11.0

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
