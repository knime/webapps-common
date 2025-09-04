# @knime/styles

## 1.13.0

### Minor Changes

- 712590e: Align ai-description.svg with SVG guidelines. Update node alignment icons with reworked ones.

## 1.12.1

### Patch Changes

- e06f88c: Add a .hover class the a style of the RTE to be able to fake the hover with js.

## 1.12.0

### Minor Changes

- 95587b5: Add ai-description.svg icon

## 1.11.1

### Patch Changes

- 73ea3a3: Correct DataType icon use for missing and path variables

## 1.11.0

### Minor Changes

- 0df972d: Dependency updates. Mostly relevant:

  - vite, vitest (and coverage reporter), vite-plugin-vue, vue-tsc
  - tiptap
  - vueuse/core

  Other improvements:

  - Updated license-checker to allow for Open Font License (OFL)
  - Updated svgo.config.d.ts to fix detection of svg config when supplying it to the vite-svg-loader plugin in vite.config files
  - Remove usages of interface in favor of type, when used in .vue; interfaces create multiple type issues when inferring props, etc which are likely caused by the declaration merging feature of interfaces.

## 1.10.0

### Minor Changes

- 51d4769: Remove usages of the FunctionalComponent type for svg icon imports and replace it with the more proper Component type

## 1.9.0

### Minor Changes

- 11332fe: Add icons to open and minimize large dialog

## 1.8.0

### Minor Changes

- 88df4da: add new hand and map icons

## 1.7.0

### Minor Changes

- 8e21558: Added new color to the knime color collection

## 1.6.0

### Minor Changes

- 04258bf: Add type icons for database objects

## 1.5.0

### Minor Changes

- 8e0a90a: Add DBTableSelector icon

## 1.4.0

### Minor Changes

- 6e1501f: add knar file icon

## 1.3.1

### Patch Changes

- b10e3aa: Add filled message icons

## 1.3.0

### Minor Changes

- 976dba9: Added new user-add icon

## 1.2.0

### Minor Changes

- ea2bc0b: Add DateTimeFormatInput component.

## 1.1.1

### Patch Changes

- update public and private space icons

## 1.1.0

### Minor Changes

- df2caa5: Removed unused square filled colored icons

## 1.0.11

### Patch Changes

- fixed sizing on local-space and execution-context-shared icons

## 1.0.10

### Patch Changes

- 337e26b: Adjust color names to default color naming scheme

## 1.0.9

### Patch Changes

- e114a57: Add InlineMessage component

## 1.0.8

### Patch Changes

- 3e2c166: Added a default file icon

## 1.0.7

### Patch Changes

- 9f80e7f: Added file-plus icon

## 1.0.6

### Patch Changes

- 1bec85f: remove external link icon from RTE styles mixin

## 1.0.5

### Patch Changes

- 0d185ea: address issue in subdependency

## 1.0.4

### Patch Changes

- 63f2b55: updated reddit icon

## 1.0.3

### Patch Changes

- 15a0549: added reddit icon

## 1.0.2

### Patch Changes

- 4de967c: Updated README

## 1.0.1

### Patch Changes

- 63cf961: convert color files to TS. use tsx for generate-css script
