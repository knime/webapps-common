# ![Image](https://www.knime.com/sites/default/files/knime_logo_github_40x40_4layers.png) KNIME® Webapps-Common

## Shared files for KNIME® web projects with JS, Vue and/or Nuxt

This project is a monorepo that packages shared config files, Vue components, CSS files, utilities, etc. that can be used for the frontend
of all KNIME web projects.

This repository is maintained by [UI Core](mailto:team-ui-core@knime.com).

## Demo

A demo of all contained UI components, icons, CSS colors etc. can be found here:
https://knime.github.io/webapps-common/

## Usage

Please see the [published packages on npm](https://www.npmjs.com/search?q=%40knime) as well as the [`packages/`](packages) folder to access the relevant files and directories.

## Development

The demo application also serves as a development environment (code lives in [`demo/`](demo) folder). You can run it using [pnpm]:

```sh
# Navigate to the demo repository
cd demo

# Install demo dependencies
pnpm install

# Run the demo locally
pnpm dev
```

### Git hooks

When committing your changes, a couple of commit hooks will run via [husky].

- `pre-commit` hook to lint and format the changes in your stage zone (via [lintstaged])
- `prepare-commit-msg` hook to format your commit message to conform with the required format by KNIME. In order for this to work you must set environment variables with your Atlassian email and API token. Refer to `@knime/eslint-config/scripts/README.md` for more information.

### Maintaining changelogs & publishing to npm

Every PR must include changeset file(s) out of which the CHANGELOG file of each package will get generated. Use the following command to create such files:

```sh
pnpm run changeset
```

Do merge those files with the PR to master.

#### Publishing to npm

The [`release` GitHub Action](./.github/workflows/release.yml) will automatically create & update a "Version Packages" PR if it detects
changeset file(s) on master. Once a release should be published to npm, simply do merge this PR.

# Join the Community!

- [KNIME Forum](https://forum.knime.com/)

[pnpm]: https://pnpm.io/
[husky]: https://www.npmjs.com/package/husky
[lintstaged]: https://github.com/okonet/lint-staged
