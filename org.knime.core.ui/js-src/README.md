# ![Image](https://www.knime.com/files/knime_logo_github_40x40_4layers.png) KNIME views & dialogs

This repository contains the frontend components of the KNIME views and dialogs which are based on [Vue].
They are built as [Vue libraries] and used in KNIME Analytics Platform and/or KNIME WebPortal.

## Development

### Prerequisites

- Install [Node.js][node], see version in [package.json](package.json).

Newer versions may also work, but have not been tested.

### Install dependencies

```sh
npm install
```

and then use the following commands. For detailed explanations see [Vue CLI docs]:

### View development in KNIME Analytics Platform

First, depending on which view you want to develop, start the according dev command (see [package.json](package.json)) which
starts a web server and re-builds the library on source file change. E.g. for the TableView it would be:

```sh
npm run dev:TableView
```

Second, please add following to the run configuration in Eclipse and start KNIME Analytics Platform:

```
-Dorg.knime.ui.dev.node.view.url=http://localhost:4000/<ComponentName>.umd.js
-Dchromium.remote_debugging_port=8888
```

`<ComponentName>` needs to be filled with the component you want to develop, e.g.:
`-Dorg.knime.ui.dev.node.view.url=http://localhost:4000/TableView.umd.js`

When opening a view in KNIME Analytics Platform the above JS file will be loaded instead of the bundled one.
Hot-code reloading is not supported yet, so you need to refresh the browser window manually for now.

Currently no standalone development mode is supported.

### Dialog development in KNIME Analytics Platform

Node dialogs can be integrated during development quite similar to views (see above), e.g. run

```sh
npm run dev:NodeDialog
```

and set the following in the run configuration of Eclipse:

```
-Dorg.knime.ui.dev.node.dialog.url=http://localhost:3333/NodeDialog.umd.js
```

For dialogs there also is a standalone dev app with mocks available:

```sh
npm run dev:NodeDialog:standalone
```

### Git hooks

When committing your changes, a couple of commit hooks will run via [husky].

- `pre-commit` hook to lint and format the changes in your stage zone (via [lintstaged])
- `prepare-commit-msg` hook to format your commit message to conform with the required format by KNIME. In order for this to work you must set environment variables with your Atlassian email and API token. Refer to `@knime/eslint-config/scripts/README.md` for more information.

### Testing

#### Running unit tests

This project contains unit tests written with [vitest]. They are run with

```sh
npm run test
```

or one can run unit- and integration-tests individually by

```sh
npm run test:unit
npm run test:integration
```

You can generate a coverage report with

```sh
npm run coverage
```

The output can be found in the `coverage` folder. It contains a browseable html report as well as raw coverage data in
[LCOV] and [Clover] format, which can be used in analysis software (SonarQube, Jenkins, …).

### Running security audit

npm provides a check against known security issues of used dependencies. Run it by calling

```sh
npm run audit
```

### Logging

You can log using the global `consola` variable (which the embedding application needs to provide).

See https://github.com/nuxt/consola for details.

## Building

To build all views and dialogs, use the following command:

```sh
npm run build
```

To build a single item, use e.g. the following command:

```sh
npm run build:TableView
```

Results are saved to `/dist`.

This project can also be built via a maven build wrapper

```sh
mvn clean install
```

## Embedding the views in apps

The views can be used in Vue/Nuxt apps like a regular Vue component, e.g. loaded asynchronously.

### Requirements

The views expect that the embedding app provides the following:

- Vue and Consola compatible to the versions defined in [`package.json`](package.json)
- global `window.consola` instance for logging
- CSS variables as defined in the `@knime/styles` project.
  They are not included in the build in order to avoid duplication.

### Usage example

```
<TableView>
```

# Join the Community!

- [KNIME Forum](https://forum.knime.com/)

[Vue]: https://vuejs.org/
[node]: https://knime-com.atlassian.net/wiki/spaces/SPECS/pages/905281540/Node.js+Installation
[Java]: https://www.oracle.com/technetwork/java/javase/downloads/index.html
[Vue CLI docs]: https://cli.vuejs.org/guide/
[Vue libraries]: https://cli.vuejs.org/guide/build-targets.html#library
[vitest]: https://vitest.dev/
[LCOV]: https://github.com/linux-test-project/lcov
[Clover]: http://openclover.org/
[husky]: https://www.npmjs.com/package/husky
[lintstaged]: https://github.com/okonet/lint-staged
