---
"@knime/eslint-config": minor
---

- update dependencies like eslint to 9.29.0
- add typed rules to typescript and vue3-typescript configs
  - export factory functions which take the path to the tsconfig eslint should use
- add ts to nuxt config (vue3 -> vue3-typescript)
- also check `package.json` for banned dependencies
- add eslint suppression file
