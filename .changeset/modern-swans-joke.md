---
"@knime/utils": patch
"@knime/rich-text-editor": patch
---

minor fixes:

- add ts-ignore for js import of `svgWithTitle`, so that it doesn't fail type-check
  in consuming repositories
- remove `.ts` extension from import
