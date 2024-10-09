---
"@knime/components": minor
---

Added 5 new status variants to the pill component, which are "success", "info", "warning", "error" and "promotion. These variants style a potentially provided icon. Additionally a "default" and "light" variant can be used, which represent the currently available states and do not provide a default styling for a passed icon.

- BREAKING CHANGE: `color` prop of Pill component removed \
  `color: "gray"` -> `variant: "default"` and \
  `color: "white"` -> `variant: "light"`
- BREAKING CHANGE: `type` prop of InlineMessage component renamed to `variant`
