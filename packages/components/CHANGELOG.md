# @knime/components

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
