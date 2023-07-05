## prepare-commit-msg

The [prepare-commit-msg](prepare-commit-msg) script serves as an integration for [Husky's][husky] `prepare-commit-msg` hook on our frontend repositories. It will format the commit message based on your branch name (provided it has a JIRA ticket ID) following KNIME's [commit message guidelines][commit-guidelines].

In a nutshell, the script will check your environment for the presence of a variable named `KNIME_ATLASSIAN_EMAIL` and `KNIME_ATLASSIAN_API_TOKEN`, which as their names state, they correspond to your Atlassian email and API token respectively.

## Usage

1. Generate your Atlassian API token as described [here][atlassian-api-tokens]
2. set `KNIME_ATLASSIAN_EMAIL` environment variable to your email address

   - MacOS: add the following line to `~/.zprofile`

     `export KNIME_ATLASSIAN_EMAIL=your@email.com`

3. set `KNIME_ATLASSIAN_API_TOKEN` as environment variable, or:

**Recommended:** if you don't want to store the API token as plain text you can use a secret storage tool.

- on MacOS, use the built-in [`security`][macos-security] command:

  `security add-generic-password -s KNIME_ATLASSIAN_API_TOKEN -a $USER -w`

- on Linux, use the `secret-tool` program. Refer to your own distribution's documentation to know about install details. e.g [Ubuntu](https://manpages.ubuntu.com/manpages/focal/man1/secret-tool.1.html), [Arch](https://man.archlinux.org/man/secret-tool.1.en)

  `secret-tool store --label="KNIME Atlassian API token" name KNIME_ATLASSIAN_API_TOKEN`

The script will now run as part of your regular git workflow.

## Adding it to a new repository

- Follow [Husky's][husky] installation instructions
- Create a file `.husky/prepare-commit-msg` with the following content:

  `source ./path/to/webapps-common/scripts/prepare-commit-msg`

[husky]: https://typicode.github.io/husky/#/
[commit-guidelines]: https://knime-com.atlassian.net/wiki/spaces/SPECS/pages/400228362/Git+Workflow#%5BinlineExtension%5DCommitting
[atlassian-api-tokens]: https://id.atlassian.com/manage-profile/security/api-tokens
[macos-security]: https://ss64.com/osx/security.html
