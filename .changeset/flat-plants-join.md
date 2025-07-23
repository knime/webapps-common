---
"@knime/ui-extension-service": minor
"@knime/rich-text-editor": minor
"@knime/hub-features": minor
"@knime/virtual-tree": minor
"@knime/components": minor
"@knime/jsonforms": minor
"@knime/licenses": minor
"@knime/styles": minor
"demo": minor
"@knime/ui-extension-renderer": minor
---

Dependency updates. Mostly relevant:

- vite, vitest (and coverage reporter), vite-plugin-vue, vue-tsc
- tiptap
- vueuse/core

Other improvements:

- Updated license-checker to allow for Open Font License (OFL)
- Updated svgo.config.d.ts to fix detection of svg config when supplying it to the vite-svg-loader plugin in vite.config files
- Remove usages of interface in favor of type, when used in .vue; interfaces create multiple type issues when inferring props, etc which are likely caused by the declaration merging feature of interfaces.
