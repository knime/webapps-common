# @knime/components

## 1.1.4

### Patch Changes

- 0dfd63d: UIEXT-872: added search input to dropdowns

## 1.1.3

### Patch Changes

- Updated dependencies [9f80e7f]
  - @knime/styles@1.0.7
  - @knime/utils@1.0.12

## 1.1.2

### Patch Changes

- 6b380fb: DateTimeInput: add support for time zone selection

## 1.1.1

### Patch Changes

- Updated dependencies [1bec85f]
  - @knime/styles@1.0.6
  - @knime/utils@1.0.11

## 1.1.0

### Minor Changes

- 7b8c18f: When the dropdown is used with slotted content the slotted content will also be used for the selected value.

### Patch Changes

- 0d185ea: address issue in subdependency
- Updated dependencies [0d185ea]
  - @knime/styles@1.0.5
  - @knime/utils@1.0.10

## 1.0.16

### Patch Changes

- Updated dependencies [63f2b55]
  - @knime/styles@1.0.4
  - @knime/utils@1.0.9

## 1.0.15

### Patch Changes

- fed323e: Add 'name' property to all components utilizing Options API. This is necessary to properly stub components in unit tests using Vue Test Utils.

## 1.0.14

### Patch Changes

- b542f53: Export TwinlistModelValue

## 1.0.13

### Patch Changes

- Extended InputField to focus on mount via props

## 1.0.12

### Patch Changes

- Updated dependencies [15a0549]
  - @knime/styles@1.0.3
  - @knime/utils@1.0.8

## 1.0.11

### Patch Changes

- 86c6ca6: Fix Image Document Initialization on SSR apps
  Updated README
- 90424b2: Exported BaseModal component
- Updated dependencies [4de967c]
  - @knime/styles@1.0.2
  - @knime/utils@1.0.7

## 1.0.10

### Patch Changes

- 9044ad2: add v-bind $attrs to InputField component to pass through attrs bound from outside into the component automatically

## 1.0.9

### Patch Changes

- 8d1c239: TagList:

  - add ability to control show all from outside (optional v-model)
  - add keyboard navigation support (activate via enter)
  - move focus after show more on the next item
  - fix hover/focus bug for show-more (+<NUM>)
  - add prop to sort by active elements (show active first)

  Tag:

  - add focus visible (keyboard nav) style
  - change hover style
  - make focusable

## 1.0.8

### Patch Changes

- Updated dependencies [20b0b36]
  - @knime/utils@1.0.6

## 1.0.7

### Patch Changes

- e48ef4d: replace mousedown event with pointerdown event in useKeyPressedUntilMouseClick to prevent timing issues

## 1.0.6

### Patch Changes

- Updated dependencies [63cf961]
  - @knime/styles@1.0.1
  - @knime/utils@1.0.5

## 1.0.5

### Patch Changes

- a087e42: Specify `sideEffects: false` to allow for better tree shaking
- b2c9869: fix inconsistent consola versions
- Updated dependencies [a087e42]
- Updated dependencies [b2c9869]
  - @knime/utils@1.0.4

## 1.0.4

### Patch Changes

- Export DateTimeInput under @knime/components/date-time-input and remove it from top-level export

## 1.0.3

### Patch Changes

- d8340c6: Updated Dependencies (Typescript + v-calendar)
- 2d43ad8: Move svgWithTitle component from @knime/utils to @knime/components
- deed6b1: Move `useNameValidator` to composables (was previously not exported)
- 34248af: Export all components from the `node` folder (e.g NodeTorso, DialogOptions, etc)
- Updated dependencies [2d43ad8]
- Updated dependencies [d818500]
  - @knime/utils@1.0.3

## 1.0.2

### Patch Changes

- Updated dependencies [45d2d81]
  - @knime/utils@1.0.2

## 1.0.1

### Patch Changes

- b311cae: NXT-2736: fix recursive update in watcher
- a40d582: Move the `useMultiSelection` and `useFocusableMultiSelection` composables from `FileExplorer` to the composables folder and export them. They can be used by other components.
- Updated dependencies [05c9114]
- Updated dependencies [0c594bd]
  - @knime/utils@1.0.1
