# knime-build-tools

This interally developed and maintained NPM package is included in the `webapps-common` repository and contains build utilities for various KNIME Web Projects. Because this package is a dependency
of `webapps-common`, the scripts defined in this package should be defined in `webapps-common/package.json` file using the `--prefix` for easier use from a parent project.

## Tools and Functionality

### 1.) Open Source Credits

`npm run --prefix /webapps-common opensourcecredits`

Used for collecting licenses for parent projects and writing them to a `JSON` file. This file is written to locally to `~webapps-commons/build-tools/opensourcecredits/used-packages.json`. **Note:** this file is untracked by **git** and is only intended to be used during the build step for an application using this script.
