---
"@knime/components": minor
---

Rework interaction behaviour of date-time format picker to bring it in-line with date picker

- There is a new selection state for keyboard navigation, so the currently applied format remains clearly visible at all times
- Single-clicking applies a format and closes the popover (previously double-clicking was required)
- `useDropdownNavigation` now exposes a `setElement` method, allowing to set a consistent dropdown state from outside. The `currentIndex` ref it exposes is now read-only
