# ![Image](https://www.knime.com/sites/default/files/knime_logo_github_40x40_4layers.png) @knime/eslint-config

This repository contains an [ESLint] ruleset for typical KNIME frontend projects. Rules cover simple
JavaScript/TypeScript setups as well as [Vue]/[Nuxt] projects and common test scenarios with [Vitest].

Also it contains configs for [Stylelint], [lintstaged] and a Git hook to format commit messages.

Code formatting is supposed to be handled via [Prettier].

## Development

### Prerequisites

- Install [Node.js][node], see version in [package.json](package.json).

Newer versions may also work, but have not been tested.

## Installation

To install the `@knime/eslint-config` package, you can use npm:

```sh
npm install @knime/eslint-config -D
```

### Linting

The different ESLint profiles contained herein can also be linted by running

```sh
npm run lint
```

## Using the ESLint profiles in your project

Projects need to specify the following `devDependencies` in their `package.json` files, but none of the required additional plugins:

- [ESlint]
- [Stylelint]
- [Prettier]

The following code block should give an understanding of a commonly used setup
in your `eslint.config.js` file:

```js
import knimeVue3Config from "@knime/eslint-config/vue3.js"

export default = [
  ...knimeVue3Config,
  {
    globals: {
      consola: true,
    }
  },
  // [...]
];
```

## Using Stylelint in your project

The following code block should give an understanding of a commonly used setup in your `.stylelintrc` file:

```js
module.exports = {
  extends: ["@knime/eslint-config/stylelint/vue"],
};
```

See [stylelint](stylelint) folder for available configs.

## Using Git hooks in your project

The package supplies the tools to running a couple of commit hooks:

### Linting and formatting staged changes

Include the following in a `pre-commit` hook to lint and format the changes in your stage zone (via [lintstaged]).

```bash
#!/usr/bin/env bash
pnpm dlx lint-staged
```

Additionaly, use the [lint-staged.config.mjs](lint-staged.config.mjs) file to configure lint-staged, i.e. create a `lint-staged.config.mjs` file in the root folder containing

```js
import config from "@knime/eslint-config/lint-staged.config.mjs";
export default config;
```

### Format commit message

Use a `prepare-commit-msg` hook to format your commit message to conform with the required format by KNIME:

```bash
#!/usr/bin/env bash
npm exec knime-eslint-config-prepare-commit-msg "$@"
```

In case the npm project isn't in the root folder, please do:

```bash
#!/usr/bin/env bash
<path-to-npm-project>/node_modules/.bin/knime-eslint-config-prepare-commit-msg "$@"
```

Refer to [scripts/README.md](scripts/README.md) for more information.

[node]: https://knime-com.atlassian.net/wiki/spaces/SPECS/pages/905281540/Node.js+Installation
[ESLint]: https://eslint.org/
[Stylelint]: https://stylelint.io/
[Prettier]: https://prettier.io/
[Vue]: https://vuejs.org/
[Nuxt]: https://nuxtjs.org/
[Vitest]: https://vitest.dev/
[lintstaged]: https://github.com/okonet/lint-staged
