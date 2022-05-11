# ![Image](https://www.knime.com/files/knime_logo_github_40x40_4layers.png) KNIME® forms

This internally developed and maintained NPM package is included in the `webapps-common` repository and contains build
utilities for various KNIME Web Projects. Because this package is a dependency of `webapps-common`, the scripts
defined in this package should be defined in `webapps-common/package.json` file using the `--prefix` for easier use
from a parent project.

## Usage
---
You should follow these steps
 
1. include this project as a [git submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
1. add it as an npm dependency:  
    ```json
    {
     "devDependencies": {
       "webapps-common": "file:webapps-common/@knime/forms"
     }
    }
    ```

## Demo

A demo of all contained UI components, icons, CSS colors etc. can be found here:
https://knime.github.io/webapps-common/

# Join the Community!
* [KNIME Forum](https://forum.knime.com/)
