# @knime/licenses

Internal utility functions checking all dependencies for allowed licenses and reporting disallowed ones.

It exposes a command line tool `license-check` which can be used as npm or npx run script in an importing package.

The options you can pass to the tool are documented below and can also be viewed by passing the `--help` option.

<pre>Options:  
-V, --version output the version number
-c, --check-only Check for valid licenses and report not allowed ones
-s, --summary Print a summary of all used licenses
-o, --output <file> Location of the output file to be created, relative to the calling project root
-h, --help display help for command</pre>
