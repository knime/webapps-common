---
"@knime/components": patch
---

Explicitly export MenuItemsProps to resolve ts issues in library builds (e.g. table) which use the SubMenu and therefore implicitly use the MenuItemsProps.
Remove warning when building jsonforms due to LoadingIcon referencing its own package.
