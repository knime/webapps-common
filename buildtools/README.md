# knime-build-tools

This internally developed and maintained NPM package is included in the `webapps-common` repository and contains build
utilities for various KNIME Web Projects. Because this package is a dependency of `webapps-common`, the scripts
defined in this package should be defined in `webapps-common/package.json` file using the `--prefix` for easier use
from a parent project.

## Tools and Functionality

### 1.) Open Source Credits

`npm run --prefix /webapps-common opensourcecredits`

Optional flags:

`--no-overwrite` prevents the overwrite of existing `used-packages.json` files.

Used for collecting licenses for parent projects and writing them to a `JSON` file. The script only collects license
information from production dependencies (listed in the `package.json` file under `dependencies`) and **not** any
packages listed under `devDependencies` or `peerDependencies`.
**Therefore, any package that doesn't need to be displayed to the user should be listed under `devDependencies`.**
The output file is written to locally to `~webapps-commons/build-tools/opensourcecredits/used-packages.json`. If the
file already exists (and the `--no-overwrite` flag hasn't seen provided; @see above), the existing file will be
overwritten with the new content.

**Note:** this file is un-tracked by **git** and is only intended to be used during the build step for an application
using this script.