# ![Image](https://www.knime.com/sites/default/files/knime_logo_github_40x40_4layers.png)@knime/pnpm-audit-resolver

PNPM Audit Resolver

## How It Works

- The script looks for an `audit-resolve.json` file in your project’s root directory.
- It reads each GHSA ID, a `decision` (e.g. `"ignore"`), and an expiration timestamp (`expiresAt`).
- It compares the expiration timestamp with the current date (`Date.now()`):
  - **If the GHSA is not expired** (i.e., `Date.now() < expiresAt`), it ensures that GHSA ID is listed in `pnpm.auditConfig.ignoreGhsas`.
  - **If expired**, it removes that GHSA ID from the ignore list.
- It then updates your `package.json` accordingly to ensure that temporary ignore rules are automatically removed once their grace period has passed.

## Usage

1. Create a file named `audit-resolve.json` in your project root. When you run `pnpm audit`, each entry has a `GHSA ID`. You should use this ID as a key, mapping to an object with:

- decision: Typically "ignore".
- expiresAt: A Unix timestamp (milliseconds) indicating when the ignore decision expires.

```
{
  "GHSA-1234-abcd-wxyz": {
    "decision": "ignore",
    "expiresAt": 1726923450122
  },
  "GHSA-4321-dcba-zywx": {
    "decision": "ignore",
    "expiresAt": 1726923450122
  }
}
```

2. Use the exposed `audit-resolve` command line tool in your repository's `package.json` which can be used with pnpm to run the resolver script

```
{
    "scripts":{
        "audit:resolve": "pnpm audit-resolve"
    }
}
```

3. Append this command to the audit command, so that it always runs before the auditing

```
"audit": "pnpm audit:resolve && pnpm audit --prod",
```
