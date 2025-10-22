# @knime/ui-extension-service

## 2.5.3

### Patch Changes

- b6c2eb9: add repository link to package.json

## 2.5.2

### Patch Changes

- 4099706: Update vite and vueuse

## 2.5.1

### Patch Changes

- 73ea3a3: Correct DataType icon use for missing and path variables

## 2.5.0

### Minor Changes

- 0df972d: Dependency updates. Mostly relevant:

  - vite, vitest (and coverage reporter), vite-plugin-vue, vue-tsc
  - tiptap
  - vueuse/core

  Other improvements:

  - Updated license-checker to allow for Open Font License (OFL)
  - Updated svgo.config.d.ts to fix detection of svg config when supplying it to the vite-svg-loader plugin in vite.config files
  - Remove usages of interface in favor of type, when used in .vue; interfaces create multiple type issues when inferring props, etc which are likely caused by the declaration merging feature of interfaces.

## 2.4.1

### Patch Changes

- 0f074fc: add bubbling of escape event over iframe boundary (via custom event)

## 2.4.0

### Minor Changes

- 76a88bb: Improve setup for iframe embedding by communicating a "ready" message
  which can be used by embedders to detect when initial setup of the iframe
  proxy and base service is complete

## 2.3.0

### Minor Changes

- 493c9f0: TS improvements
  - removed namespaces: UIExtensionPushEvents
  - replaced any with fitting type or unknown/never

## 2.2.0

### Minor Changes

- 4ee61de: Enabled warning messages on apply

## 2.1.1

### Patch Changes

- c1766a5: Add view for blocking errors

## 2.1.0

### Minor Changes

- 1f2459e: update node version to node 22.11.0

## 2.0.1

### Patch Changes

- e392961: Version bump of v-calendar in the pnpm-lock which should have been part of a previous version bump

## 2.0.0

### Major Changes

- 52708e6: Moved UIExtension API definition from @knime/ui-extension-service to @knime/ui-extension-renderer. Breaking changes for embedders (i.e. consumers of knime/ui-extension-renderer): The vue components are available under "@knime/ui-extension-renderer/vue" now (along with all necessary types). For ui extensions (i.e. consumerts of @knime/ui-extension-service): The API no longer uses Enums but instead union types of concrete strings.

## 1.2.1

### Patch Changes

- d58ea81: Fix direct import to prevent typescript error

## 1.2.0

### Minor Changes

- 893d560: Add IntervalInput component for setting either date or time intervals

## 1.1.0

### Minor Changes

- f51877c: Change UI Extension Alert API to expose more details to the embedder

## 1.0.2

### Patch Changes

- c5069f0: Clean flawed flow variables on apply

## 1.0.1

### Patch Changes

- 29856fd: Add push event for whether the data value view is open or closed

## 1.0.0

### Major Changes

- 86327c6: Moved ui-extension-service to webapps-common monorepo setup
  BREAKING CHANGE: The iife builds need to be imported from `@knime/ui-extension-service/iife` now (or `iifeDev` respectively).

### Patch Changes

- 9d19c8a: Remove canBeEnlarged and add startEnlarged property to UIExtensionServiceConfig
