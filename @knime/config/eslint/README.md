# KNIME ESLint config

This repository contains an [ESLint] ruleset for typical KNIME frontend projects. Rules cover simple TypeScript setups
as well as [Vue2]/[Vue3] and [Nuxt] projects. A few overrides to cover common test scenarios with [Jest] are also
present.

## Development

### Prerequisites

* Install [Node.js][node], see version in [package.json](package.json).

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

### Running security audit

npm provides a check against known security issues of used dependencies. Run it by calling

```sh
npm audit
```

## Using the ESLint Profiles in your project

The ESLint profiles in most cases come with pre-packaged ESLint plugins and plugin configurations. However there is a
long standing [issue with ESLint](https://github.com/eslint/eslint/issues/3458) which makes it a cumbersome setup.
To remedy this shortcoming you can use a [patch](https://www.npmjs.com/package/@rushstack/eslint-patch) which is pulled
in as a transitive dependency already. The following code block should give an understanding of a commonly used setup
in your `.eslintrc.js` file:

```js
// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  extends: [
    "@knime/eslint-config/vue3"
  ],
  globals: {
    consola: true
  },
  // [...]
}
```

### Requirements

Projects using ESLint profiles defined herein need to still specify [ESlint] as a `devDependency` in their respective `package.json` files, but none of the required additional plugins. See [package.json](package.json) for supported
[ESLint] versions.

[node]: https://knime-com.atlassian.net/wiki/spaces/SPECS/pages/905281540/Node.js+Installation
[ESLint]: https://eslint.org/
[Vue2]: https://v2.vuejs.org/
[Vue3]: https://vuejs.org/
[Nuxt]: https://nuxtjs.org/
[Jest]: https://jestjs.io/en