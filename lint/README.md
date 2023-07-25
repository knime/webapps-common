# KNIME ESLint/Stylelint config

This repository contains an [ESLint] ruleset for typical KNIME frontend projects. Rules cover simple
JavaScript/TypeScript setups as well as [Vue2]/[Vue3] and [Nuxt] projects. A few overrides to cover common test
scenarios with [Jest] and [Vitest] are also present.

Also it contains some configs for [Stylelint].

Formatting is supposed to be handled via [Prettier].

## Development

### Prerequisites

- Install [Node.js][node], see version in [package.json](package.json).

Newer versions may also work, but have not been tested.

### Install dependencies

```sh
npm install
```

and then use the following commands.

### Linting

The different ESLint profiles contained herein can also be linted by running

```sh
npm run lint
```

### Git hooks

The package supplies the tools to running a couple of commit hooks.

#### Linting and formatting staged changes

Include the following in a `pre-commit` hook to lint and format the changes in your stage zone (via [lintstaged]).

```bash
#!/usr/bin/env bash
npx lint-staged
```

Additionaly, use the [lint-staged.config.mjs](lint-staged.config.mjs) file to configure lint-staged, i.e. create a `lint-staged.config.mjs` file in the root folder containing

```js
import config from "@knime/eslint-config/lint-staged.config.mjs";
export default config;
```

#### Format commit message

Use a `prepare-commit-msg` hook to format your commit message to conform with the required format by KNIME:

```bash
#!/usr/bin/env bash
knime-eslint-config-prepare-commit-msg "$@"
```

Refer to [scripts/README.md](scripts/README.md) for more information.

### Running security audit

npm provides a check against known security issues of used dependencies. Run it by calling

```sh
npm audit
```

## Using the ESLint profiles in your project

The ESLint profiles in most cases come with pre-packaged ESLint plugins and plugin configurations. However there is a
long standing [issue with ESLint](https://github.com/eslint/eslint/issues/3458) which makes it a cumbersome setup.
To remedy this shortcoming you can use a [patch](https://www.npmjs.com/package/@rushstack/eslint-patch) which is pulled
in as a transitive dependency already. The following code block should give an understanding of a commonly used setup
in your `.eslintrc.js` file:

```js
// This is a workaround for https://github.com/eslint/eslint/issues/3458
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  extends: ["@knime/eslint-config/vue3"],
  globals: {
    consola: true,
  },
  // [...]
};
```

## Using Stylelint in your project

The following code block should give an understanding of a commonly used setup in your `.stylelintrc` file:

```js
module.exports = {
  extends: ["@knime/eslint-config/stylelint/vue"],
};
```

See [stylelint](stylelint) folder for available configs.

### Requirements

Projects still need to specify the following `devDependency` in their respective `package.json` files, but none of the required additional plugins:

- [ESlint]
- [Stylelint]
- [Prettier]

[node]: https://knime-com.atlassian.net/wiki/spaces/SPECS/pages/905281540/Node.js+Installation
[ESLint]: https://eslint.org/
[Stylelint]: https://stylelint.io/
[Prettier]: https://prettier.io/
[Vue2]: https://v2.vuejs.org/
[Vue3]: https://vuejs.org/
[Nuxt]: https://nuxtjs.org/
[Jest]: https://jestjs.io/en
[Vitest]: https://vitest.dev/
[lintstaged]: https://github.com/okonet/lint-staged
