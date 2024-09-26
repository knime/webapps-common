# ![Image](https://www.knime.com/sites/default/files/knime_logo_github_40x40_4layers.png) KNIME® Webapps-Common

## Shared files for KNIME® web projects with JS, Vue and/or Nuxt

This project is a monorepo that packages shared config files, Vue components, CSS files, utilities, etc. that can be used for the frontend
of all KNIME web projects.

## Demo

A demo of all contained UI components, icons, CSS colors etc. can be found here:
https://knime.github.io/webapps-common/

Same application also serves as a development environment (code lives in `demo` folder)

```sh
cd demo
```

You must install the dependencies only with [PNPM]

```sh
pnpm install
```

and can be run locally by calling

```sh
pnpm dev
```

### Git hooks

When committing your changes, a couple of commit hooks will run via [husky].

- `pre-commit` hook to lint and format the changes in your stage zone (via [lintstaged])
- `prepare-commit-msg` hook to format your commit message to conform with the required format by KNIME. In order for this to work you must set environment variables with your Atlassian email and API token. Refer to `@knime/eslint-config/scripts/README.md` for more information.

## Usage

---

Please navigate to the [`packages/`](packages) folder to access the relevant files and directories.

# Join the Community!

- [KNIME Forum](https://forum.knime.com/)

[PNPM]: https://pnpm.io/
[husky]: https://www.npmjs.com/package/husky
[lintstaged]: https://github.com/okonet/lint-staged
