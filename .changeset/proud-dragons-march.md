---
"@knime/components": minor
---

- Add onContextMenuOutside hook from knime-ui (vueuse `onClickOutside` ignores `contextmenu` events)
- Prevent default contextmenu behavior on BaseMenuItems
- Close file explorer context menu on file explorer options button click, if context menu was already open by option button
- Close file explorer context menu on right-click (`contextmenu` event) outside
- Combine `shift` and `flip` middleware from `floating-ui` on file explorer context menu
