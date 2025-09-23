---
"@knime/components": patch
---

FileExplorer component fixes

- Fix issue where the sourceItems for the `onMove` event were being sent empty
  when the drag animation mode was "auto"
- Fix issue where an empty folder was being displayed incorrectly (not taking the full height)
  when the `virtual` prop was used
- Fix issue where the title attribute (aka tooltip) of the items were not showing due to a
  `pointer-events: none` declaration, which was needed for the dragging behavior
- Fix issue where the text truncation via ellipsis of an item's text was not working correctly
