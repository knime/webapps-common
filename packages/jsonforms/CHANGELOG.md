# @knime/json-forms

## 1.14.2

### Patch Changes

- Updated dependencies [e7d2020]
  - @knime/components@1.33.1
  - @knime/rich-text-editor@1.6.2

## 1.14.1

### Patch Changes

- Updated dependencies [f9c2726]
  - @knime/components@1.33.0
  - @knime/rich-text-editor@1.6.1

## 1.14.0

### Minor Changes

- 51d4769: Remove usages of the FunctionalComponent type for svg icon imports and replace it with the more proper Component type

### Patch Changes

- Updated dependencies [51d4769]
  - @knime/rich-text-editor@1.6.0
  - @knime/components@1.32.0
  - @knime/styles@1.10.0
  - @knime/utils@1.5.3

## 1.13.5

### Patch Changes

- a102d60: Don't show `__regular__` or `__special__` prefix in case of missing values in SingleSelectControl.

## 1.13.4

### Patch Changes

- Updated dependencies [11332fe]
  - @knime/styles@1.9.0
  - @knime/components@1.31.2
  - @knime/rich-text-editor@1.5.2
  - @knime/utils@1.5.2

## 1.13.3

### Patch Changes

- 0660f7a: Changed callback type parameter from never to unknown

## 1.13.2

### Patch Changes

- e921ba3: Make DropdownControl more robust with respect to missing options.

## 1.13.1

### Patch Changes

- Updated dependencies [88df4da]
  - @knime/styles@1.8.0
  - @knime/components@1.31.1
  - @knime/rich-text-editor@1.5.1
  - @knime/utils@1.5.1

## 1.13.0

### Minor Changes

- 493c9f0: TS improvements
  - replaced any with fitting type or unknown/never

### Patch Changes

- Updated dependencies [493c9f0]
  - @knime/components@1.31.0
  - @knime/utils@1.5.0
  - @knime/rich-text-editor@1.5.0

## 1.12.8

### Patch Changes

- Updated dependencies [8e21558]
  - @knime/styles@1.7.0
  - @knime/components@1.30.1
  - @knime/rich-text-editor@1.4.21
  - @knime/utils@1.4.4

## 1.12.7

### Patch Changes

- Updated dependencies
  - @knime/components@1.30.0
  - @knime/rich-text-editor@1.4.20

## 1.12.6

### Patch Changes

- Updated dependencies [04258bf]
  - @knime/styles@1.6.0
  - @knime/components@1.29.2
  - @knime/rich-text-editor@1.4.19
  - @knime/utils@1.4.3

## 1.12.5

### Patch Changes

- Updated dependencies [2a0a9fd]
  - @knime/components@1.29.1
  - @knime/utils@1.4.2
  - @knime/rich-text-editor@1.4.18

## 1.12.4

### Patch Changes

- 492d1c9: Unregister error messages on unmount to prevent duplicated error messages on subsequent mount.

## 1.12.3

### Patch Changes

- Updated dependencies [5c1e0fa]
  - @knime/components@1.29.0
  - @knime/rich-text-editor@1.4.17

## 1.12.2

### Patch Changes

- Updated dependencies [8e0a90a]
  - @knime/styles@1.5.0
  - @knime/components@1.28.7
  - @knime/rich-text-editor@1.4.16
  - @knime/utils@1.4.1

## 1.12.1

### Patch Changes

- c962c75: Add utility for fixing layout metacomponents

## 1.12.0

### Minor Changes

- 64c9333: Adapt state provider logic to backend and change structure of validations

### Patch Changes

- Updated dependencies [64c9333]
  - @knime/components@1.28.5
  - @knime/rich-text-editor@1.4.15

## 1.11.4

### Patch Changes

- 04ed897: Add disabled state for ComboBox and MultiSelect
- Updated dependencies [04ed897]
  - @knime/components@1.28.4
  - @knime/rich-text-editor@1.4.14

## 1.11.3

### Patch Changes

- 82700c9: Enable possibleValues in Checkboxes renderer

## 1.11.2

### Patch Changes

- 33f0fa5: Fix combobox control value updates
- Updated dependencies [33f0fa5]
  - @knime/components@1.28.3
  - @knime/rich-text-editor@1.4.13

## 1.11.1

### Patch Changes

- 6d351f6: Enable possibleValues in RadioButton renderer ui schema"

## 1.11.0

### Minor Changes

- 7e559e2: Introduce a general mechanism for optional widgets

## 1.10.4

### Patch Changes

- 3818fbf: Add JSONForms controls for single and multi selection list
- Updated dependencies [9757f66]
  - @knime/components@1.28.2
  - @knime/rich-text-editor@1.4.12

## 1.10.3

### Patch Changes

- ca96677: Add support to hide seconds and milliseconds to time renderers

## 1.10.2

### Patch Changes

- Updated dependencies [4b9650c]
  - @knime/components@1.28.1
  - @knime/rich-text-editor@1.4.11

## 1.10.1

### Patch Changes

- Updated dependencies [7b84a54]
  - @knime/components@1.28.0
  - @knime/rich-text-editor@1.4.10

## 1.10.0

### Minor Changes

- 9ba6782: Add option to perform external validations to renderers

## 1.9.4

### Patch Changes

- Updated dependencies [e88dcfd]
  - @knime/components@1.27.0
  - @knime/rich-text-editor@1.4.9

## 1.9.3

### Patch Changes

- 87fadf9: Provide sub settings panel destination in control tests

## 1.9.2

### Patch Changes

- 5ba617c: Move teleport destination from slot to div

## 1.9.1

### Patch Changes

- 549a7f8: Introduce mulitple click away exceptions in file explorer
- Updated dependencies [549a7f8]
  - @knime/components@1.26.0
  - @knime/rich-text-editor@1.4.8

## 1.9.0

### Minor Changes

- 5c08536: Add fill prop to ErrorMessages renderer wrapper component.

## 1.8.6

### Patch Changes

- 751cb18: Styling changes for Settings Sub Panel

  - back button header is now sticky
  - back button is now yellow
  - background now matches main node dialogue
  - apply/discard buttons are visible when sub panel is open
  - button to open side drawer is now more compact

- Updated dependencies [751cb18]
  - @knime/components@1.25.4
  - @knime/rich-text-editor@1.4.7

## 1.8.5

### Patch Changes

- Updated dependencies [dea510f]
  - @knime/components@1.25.3
  - @knime/utils@1.4.0
  - @knime/rich-text-editor@1.4.6

## 1.8.4

### Patch Changes

- Updated dependencies [e177076]
  - @knime/components@1.25.2
  - @knime/rich-text-editor@1.4.5

## 1.8.3

### Patch Changes

- Updated dependencies [a5c359f]
  - @knime/components@1.25.1
  - @knime/rich-text-editor@1.4.4

## 1.8.2

### Patch Changes

- Updated dependencies [2d42337]
  - @knime/components@1.25.0
  - @knime/rich-text-editor@1.4.3

## 1.8.1

### Patch Changes

- Updated dependencies [6e1501f]
  - @knime/styles@1.4.0
  - @knime/components@1.24.2
  - @knime/rich-text-editor@1.4.2
  - @knime/utils@1.3.3

## 1.8.0

### Minor Changes

- 4997656: Rename format and renderer from typedNameFilter to typedStringFilter

## 1.7.0

### Minor Changes

- 28e1942: Introduce SingleSelection jsonforms control. Therefore remove special choices handling from other choices controls.

### Patch Changes

- Updated dependencies [803a5b9]
  - @knime/components@1.24.1
  - @knime/rich-text-editor@1.4.1

## 1.6.10

### Patch Changes

- e3f1f94: Improve validation in Number/TextInputControl

## 1.6.9

### Patch Changes

- Updated dependencies [8582dc1]
- Updated dependencies [8582dc1]
  - @knime/components@1.24.0
  - @knime/rich-text-editor@1.4.0

## 1.6.8

### Patch Changes

- Updated dependencies [9ccf905]
  - @knime/components@1.23.0
  - @knime/rich-text-editor@1.3.36

## 1.6.7

### Patch Changes

- Updated dependencies [93103f5]
  - @knime/components@1.22.2
  - @knime/rich-text-editor@1.3.35

## 1.6.6

### Patch Changes

- Updated dependencies [4cc131a]
  - @knime/components@1.22.1
  - @knime/rich-text-editor@1.3.34

## 1.6.5

### Patch Changes

- Updated dependencies [ef010ff]
  - @knime/components@1.22.0
  - @knime/rich-text-editor@1.3.33

## 1.6.4

### Patch Changes

- Updated dependencies [bb186d1]
  - @knime/utils@1.3.2
  - @knime/components@1.21.1
  - @knime/rich-text-editor@1.3.32

## 1.6.3

### Patch Changes

- Updated dependencies [02c95c8]
  - @knime/components@1.21.0
  - @knime/rich-text-editor@1.3.31

## 1.6.2

### Patch Changes

- Updated dependencies [6c99c22]
  - @knime/components@1.20.0
  - @knime/rich-text-editor@1.3.30

## 1.6.1

### Patch Changes

- Updated dependencies [5f3ca36]
  - @knime/components@1.19.4
  - @knime/rich-text-editor@1.3.29

## 1.6.0

### Minor Changes

- b30c0b8: Changes to SideDrawer related code to bring side drawer to node dialogues:

  - some new components that are used in side drawers in node dialogues
  - new SectionHeading component to avoid style duplication between side drawers in node
    dialogues and the existing SectionLayout component
  - new renderers and controls to connect the side drawer to the WebUI node dialogue framework

### Patch Changes

- Updated dependencies [b30c0b8]
  - @knime/components@1.19.3
  - @knime/rich-text-editor@1.3.28

## 1.5.14

### Patch Changes

- a674c18: Allow zero duration but disallow empty duration in IntervalInput
- Updated dependencies [a674c18]
  - @knime/components@1.19.2
  - @knime/utils@1.3.1
  - @knime/rich-text-editor@1.3.27

## 1.5.13

### Patch Changes

- Updated dependencies [0932714]
  - @knime/components@1.19.1
  - @knime/rich-text-editor@1.3.26

## 1.5.12

### Patch Changes

- 4aa2490: Remove prop to filter invalid selected values on possible value change
- Updated dependencies [4aa2490]
  - @knime/components@1.19.0
  - @knime/rich-text-editor@1.3.25

## 1.5.11

### Patch Changes

- Updated dependencies
  - @knime/components@1.18.8
  - @knime/rich-text-editor@1.3.24

## 1.5.10

### Patch Changes

- 992a9e4: Make type in date&time format picker controllable
- Updated dependencies [992a9e4]
  - @knime/components@1.18.7
  - @knime/rich-text-editor@1.3.23

## 1.5.9

### Patch Changes

- Updated dependencies [3fd06dd]
  - @knime/components@1.18.6
  - @knime/rich-text-editor@1.3.22

## 1.5.8

### Patch Changes

- Updated dependencies [59af778]
- Updated dependencies [59af778]
  - @knime/utils@1.3.0
  - @knime/components@1.18.5
  - @knime/rich-text-editor@1.3.21

## 1.5.7

### Patch Changes

- 370f5b0: Adjust styling of error message and surrounding spacing

## 1.5.6

### Patch Changes

- Updated dependencies [b10e3aa]
  - @knime/styles@1.3.1
  - @knime/components@1.18.4
  - @knime/rich-text-editor@1.3.20
  - @knime/utils@1.2.7

## 1.5.5

### Patch Changes

- ea0b6b5: Make the v-for key independent of the external context

## 1.5.4

### Patch Changes

- Updated dependencies
  - @knime/components@1.18.3
  - @knime/utils@1.2.6
  - @knime/rich-text-editor@1.3.19

## 1.5.3

### Patch Changes

- Updated dependencies
  - @knime/components@1.18.2
  - @knime/rich-text-editor@1.3.18

## 1.5.2

### Patch Changes

- Updated dependencies [3141407]
  - @knime/components@1.18.1
  - @knime/rich-text-editor@1.3.17

## 1.5.1

### Patch Changes

- f074583: Fix delayed initial update dispatch watcher
- Updated dependencies [976dba9]
- Updated dependencies [976dba9]
  - @knime/components@1.18.0
  - @knime/styles@1.3.0
  - @knime/rich-text-editor@1.3.16
  - @knime/utils@1.2.5

## 1.5.0

### Minor Changes

- 69e24d3: Add error messages to jsonforms renderers

## 1.4.2

### Patch Changes

- c1b0e41: Before this patch a hidden control in a horizontal layout reserved space.

## 1.4.1

### Patch Changes

- 254f32a: Fix that the control value updates depend on the browser timezone by calculating to/from UTC

## 1.4.0

### Minor Changes

- 1f2459e: update node version to node 22.11.0

### Patch Changes

- Updated dependencies [1f2459e]
  - @knime/components@1.17.0

## 1.3.4

### Patch Changes

- Updated dependencies [fd95605]
  - @knime/components@1.16.1
  - @knime/rich-text-editor@1.3.15

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
