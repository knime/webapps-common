---
"@knime/eslint-config": minor
---

Enforce that all used CSS custom properties do exist (via https://github.com/csstools/stylelint-value-no-unknown-custom-properties).

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

There might be cases where CSS properties are shared between multiple nested Vue components, there you can add
`/* stylelint-disable-next-line csstools/value-no-unknown-custom-properties */`.
