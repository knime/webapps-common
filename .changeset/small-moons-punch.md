---
"@knime/eslint-config": minor
---

Enforce that all used CSS custom properties do exist.

**Breaking change:** If the project uses global custom CSS properties (very likely), you have to make Stylelint aware of them in `.stylelintrc.cjs`, e.g.:

```
rules: {
  "csstools/value-no-unknown-custom-properties": [
    true,
    {
      importFrom: ["src/assets/index.css"],
    },
  ],
}
```

More details: https://github.com/csstools/stylelint-value-no-unknown-custom-properties
