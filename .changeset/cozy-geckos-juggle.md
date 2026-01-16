---
"@knime/components": patch
"@knime/jsonforms": patch
---

Fix invalid nested `:deep()` CSS selectors that were not being processed correctly by Vue's style compiler. This change ensures that the CSS output of `@knime/jsonforms` does not include invalid `:deep` selectors left unprocessed.
