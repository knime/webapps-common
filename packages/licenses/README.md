# ![Image](https://www.knime.com/sites/default/files/knime_logo_github_40x40_4layers.png)@knime/licenses

Internal utility functions checking all dependencies for allowed licenses and reporting disallowed ones.

It exposes a command line tool `license-check` which can be used as npm or npx run script in an importing package.

The options you can pass to the tool are documented below and can also be viewed by passing the `--help` option.

<pre>Options:  
-V, --version output the version number
-c, --check-only Check for valid licenses and report not allowed ones
-s, --summary Print a summary of all used licenses
-o, --output <file> Location of the output file to be created, relative to the calling project root
-f, --config <file> Optional project-specific license config path, relative to the calling project root
-h, --help display help for command</pre>

## Project-specific license configuration

In addition to the default config shipped with `@knime/licenses`, you can provide project-specific settings.

By default, `license-check` automatically looks for one of these files in the calling project root (`process.cwd()`):

- `license.config.js`
- `license.config.mjs`
- `license.config.cjs`
- `license.config.json`

You can also explicitly set a config file path with `--config`.

If no project config file is found, or the configured file path does not exist, the tool falls back to the default `@knime/licenses` configuration.

The project config must match the default config structure (`onlyAllow`, `excludePackages`, `manualPackages`) and is merged with the built-in defaults:

- `onlyAllow`: concatenated and de-duplicated
- `excludePackages`: concatenated and de-duplicated
- `manualPackages`: concatenated and de-duplicated by full object content
