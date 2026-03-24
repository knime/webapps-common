---
"@knime/components": minor
---

improve hints composable:

- rework internal api to remove racing conditions around initialization and duplicate watch instances
- provide optional callbacks when calling `createHint` (`onShow` and `onDismiss`)
