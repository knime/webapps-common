---
"@knime/eslint-config": patch
---

lint-staged config: improve cache for eslint and stylelint

- move into `node_modules/.cache/.eslintcache` / `node_modules/.cache/.stylelintcache`
- consistently enable the cache
