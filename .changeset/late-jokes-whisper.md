---
"@knime/eslint-config": minor
---

- re-enable default rules which were temporarily disabled in 9.0
- remove `no-undefined` and `func-style` rules
- add `eslint-plugin-depend` which checks for unwanted (e.g. legacy) dependencies
- add `e2e` folder to vitest rules
