# @knime/json-forms

## 1.3.3

### Patch Changes

- Updated dependencies [de31f24]
  - @knime/components@1.16.0
  - @knime/rich-text-editor@1.3.14

## 1.3.2

### Patch Changes

- 77891fd: Fix description style overwrite that was intended to only impact control labels.

## 1.3.1

### Patch Changes

- 09d7f1a: Fix style file rename. The last published version outputs a jsonforms.css instead of a styles.css which broke the /styles export

## 1.3.0

### Minor Changes

- b4766a7: Create combined widget for ZonedDateTime inputs

## 1.2.5

### Patch Changes

- Updated dependencies
  - @knime/components@1.15.6
  - @knime/rich-text-editor@1.3.13

## 1.2.4

### Patch Changes

- e392961: Version bump of v-calendar in the pnpm-lock which should have been part of a previous version bump
- Updated dependencies [e392961]
  - @knime/components@1.15.5
  - @knime/rich-text-editor@1.3.12

## 1.2.3

### Patch Changes

- ec12810: Replace v-calendar npm dep version with git url
- Updated dependencies [ec12810]
  - @knime/components@1.15.4
  - @knime/rich-text-editor@1.3.11

## 1.2.2

### Patch Changes

- Updated dependencies [c1bb1a7]
  - @knime/components@1.15.3
  - @knime/rich-text-editor@1.3.10

## 1.2.1

### Patch Changes

- be23d17: Allow hiding and removing labels from jsonforms control renderers

## 1.2.0

### Minor Changes

- b9fbc0d: Add dateTimeFormat renderer.

## 1.1.1

### Patch Changes

- 4ea5008: Determine asyncSetup when wrapping async controls with addLabel

## 1.1.0

### Minor Changes

- f94dddb: Handle async components to allow reactivity while wrapping in higher order components

### Patch Changes

- Updated dependencies [f94dddb]
  - @knime/components@1.15.2
  - @knime/rich-text-editor@1.3.9

## 1.0.1

### Patch Changes

- Updated dependencies [03f69d0]
  - @knime/components@1.15.1
  - @knime/rich-text-editor@1.3.8

## 1.0.0

### Major Changes

- ff330d9: Export JsonFormsDialog and associated renderers with minimal capabilities. Renderers come in two ways: Controls and layouts. This package also exposes the utilities and types to write, adjust and test controls and layouts.

## 0.1.7

### Patch Changes

- bedf0a3: Add postcss config

## 0.1.6

### Patch Changes

- Updated dependencies [ea2bc0b]
  - @knime/components@1.15.0
  - @knime/styles@1.2.0
  - @knime/rich-text-editor@1.3.7

## 0.1.5

### Patch Changes

- Don't inline styles, export created css file from build

## 0.1.4

### Patch Changes

- Changed package name @knime/json-forms -> @knime/jsonforms

## 0.1.3

### Patch Changes

- Updated dependencies [eabff98]
  - @knime/components@1.14.0
  - @knime/rich-text-editor@1.3.6

## 0.1.2

### Patch Changes

- Updated dependencies [4f06376]
  - @knime/components@1.13.1
  - @knime/rich-text-editor@1.3.5

## 0.1.1

### Patch Changes

- Updated dependencies [1787fe5]
  - @knime/components@1.13.0
  - @knime/rich-text-editor@1.3.4

## 0.1.0

### Minor Changes

- 79edc73: Extracting JSONForms integration from knime-core-ui, exposing NodeDialog component only
