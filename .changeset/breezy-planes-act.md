---
"@knime/ui-extension-renderer": minor
"@knime/ui-extension-service": minor
"@knime/hub-features": minor
"@knime/virtual-tree": minor
"@knime/components": minor
"@knime/jsonforms": minor
"@knime/licenses": minor
"@knime/utils": minor
"@knime/rich-text-editor": minor
"demo": minor
---

removed namespaces and replaced occurances of any with fitting types

- removed namespaces:
  - FileExplorerContextMenu
    - renamed contained MenuItem to FileExplorerMenuItem
  - UploadManagerNS
  - UIExtensionPushEvents
- replaced any with fitting type or unknown/never
- use generic in DropdownControl.vue
