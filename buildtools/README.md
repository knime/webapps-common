# knime-build-tools

This interally developed and maintained NPM package contains build utilities for various KNIME Web Projects. Because this package is a dependency
of `webapps-common`, the scripts defined in this package should be defined in `webapps-common` using the `--prefix` parameter for easier use.

## Open Source Credits
These files are used for collecting licenses for parent projects and writing them to a local `.json` file. 

This script can be called from a parent project using the script `npm run --prefix /webapps-common opensourcecredits`. This script can recognize two
environmental variables:

1. 
    ```js
    CREDITS_BUILD_PREFIX=...
    ```
    This value will be used as the file name (with `.json` for the file ext.) when **writing** the dependencies to the local
    directory. This is useful if you need to access dependencies from another project which uses `webapps-common`, but cannot receive these files via server.
    An example of this is the `knime-js-pagebuilder` project. This project's dependencies and licenses are required in production by the repository `knime-webportal`, but no way to provide them via the current server set up in the production environment. **_NOTE:_** using this option will create a file which is **NOT**
    included in the `.gitignore` file.
1.
    ```js
    ADD_PACKAGE_FILE=...
    ```
    In partnership with #1, this value will be used as the file name (with `.json` for the file ext.) when **reading** external dependencies from the local
    directory. This is useful if you need to access dependencies from another project which uses `webapps-common`, but cannot receive these files via server.
    An example of this is the `knime-webportal` project. This project requires the dependencies and licenses for the repository `knime-js-pagebuilder`, but
    has no access to them in production via the current server set up. The dependencies read from the filename provided by this variable will be added and
    de-duplicated in the displayed licenses for the parent project.


## Package/Version
This tooling creates the packaged updated and versioned build files for a `nuxt` project before it enter production or a test environment.

It can be called from a parent project using the script `npm run --prefix webapps-common/ package --path $INIT_CWD`, with the `$INIT_CWD` parameter
being provided to the package.