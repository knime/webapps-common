---
"@knime/eslint-config": minor
---

only warn about TODO comments without ticket it; error for FIXME comments:

We added a custom rule for TODO comments that will warn if a TODO comment does not include a ticket-id.
The pattern to use for TODO comments should be `TODO: <ticket-id>` or `TODO <ticket-id>`.
