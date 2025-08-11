---
"@knime/ui-extension-renderer": patch
---

Fix bug introduced with FSR-64. Reverting to `null` as the default value for the `initialSharedData`
prop in UIExtension.vue, because `null` is an expected fallback value and `{}` was being used instead.
