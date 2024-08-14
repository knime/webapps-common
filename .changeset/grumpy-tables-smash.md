---
"@knime/ui-extensions-renderer": patch
"@knime/components": patch
---

Add 'name' property to all components utilizing Options API. This is necessary to properly stub components in unit tests using Vue Test Utils.
