# @knime/components

## 1.9.2

### Patch Changes

- ecf7936: Enable resize handle for twinlists even if the twinlist is disabled

## 1.9.1

### Patch Changes

- f21a042: Use background color instead of transparent background in dropdown

## 1.9.0

### Minor Changes

- 2c648a8: Respect the initial value of the timezone prop as well as changes to it.

## 1.8.2

### Patch Changes

- 15a4479: display failure details as tooltip of upload item
- Updated dependencies [15a4479]
  - @knime/utils@1.1.2

## 1.8.1

### Patch Changes

- 3b80728: Reenable scroll behaviour of sort list which automatically scrolls the selected moved option into the view

## 1.8.0

### Minor Changes

- ea959e0: Added dropzone component, which can be utilized for file selection, esp. file uploads

### Patch Changes

- eb4729f: Minor UploadProgressPanelItem fixes - display progress bar also at 0%, display progress message only while status is in progress
- ea959e0: Add allowDelete prop to UploadProgressPanelItems to delete existing or uploaded items
- ea959e0: Make status and progress optional for UploadProgressPanelItems

## 1.7.4

### Patch Changes

- efdbcc0: fix issue where hints could get duplicated

## 1.7.3

### Patch Changes

- 3a67b9a: Improve useHint composable api. Fix issue where reactivity
  was lost on internal watchers for the hints composable when the composable was created as a singleton

## 1.7.2

### Patch Changes

- 3c33e6c: Changed BaseMenuItem hotkey font-weight to 400

## 1.7.1

### Patch Changes

- Updated dependencies
  - @knime/styles@1.1.1
  - @knime/utils@1.1.1

## 1.7.0

### Minor Changes

- 4ade605: - add useHints based on the one from the hub
  - add AutoPlayVideo component from hub

## 1.6.1

### Patch Changes

- fix wrong usage of shadow elevation token for the Toast component

## 1.6.0

### Minor Changes

- a8eebec: - Refactor: `ProgressItem` component
  - Reworked component to make it more general-purpose, taking props that only
    consider rendering and removing coupling to the specific upload use-case
  - Improve behavior of progressbar. Now, showing/hiding the progress bar doesn't
    cause the content of the ProgressItem to jump
  - Refactor: `ProgressList` component
    - Reworked to be a very minimal component, just handling minimal styles for
      `ProgressItem`s rendered in the default slot
  - Add: `UploadProgressPanel` component
    - Specific component tailor-made for the upload use-case. Makes use of `ProgressItem`s
  - Add: `useUploadManager` composable
    - composable that makes use of the `uploadManager` utility and provides
      reactive state to track uploads

### Patch Changes

- Updated dependencies [a8eebec]
  - @knime/utils@1.1.0

## 1.5.2

### Patch Changes

- 64039e4: Submenu items font-weight changed to 400

## 1.5.1

### Patch Changes

- b85b06dd Do not use relative import that leaves the package

## 1.5.0

### Minor Changes

- e11d91e: Added a generic progress item and progress list component which can be utilized to display for example file uploads, downloads, or general progress which is split up on multiple items.

## 1.4.5

### Patch Changes

- c12d135: Tree: add customSlot to tree node options; add two new api methods to clear a sub tree and trigger the load of the children

## 1.4.4

### Patch Changes

- e5fff5a: fix content jumping in Toast API error template
- 9364d3a: make ProgressBar smoother by adding transition

## 1.4.3

### Patch Changes

- 285389a: fix toasts not expanding after being in back of stack

## 1.4.2

### Patch Changes

- 8433348: Extend dropdown: provide flag to slot in order to know if slot is rendered as selected value or within dropdown

## 1.4.1

### Patch Changes

- 36f4ccb: Export InlineMessageVariant and PillVariant types

## 1.4.0

### Minor Changes

- 29bfef4: Added 5 new status variants to the pill component, which are "success", "info", "warning", "error" and "promotion. These variants style a potentially provided icon. Additionally a "default" and "light" variant can be used, which represent the currently available states and do not provide a default styling for a passed icon.

  - BREAKING CHANGE: `color` prop of Pill component removed \
    `color: "gray"` -> `variant: "default"` and \
    `color: "white"` -> `variant: "light"`
  - BREAKING CHANGE: `type` prop of InlineMessage component renamed to `variant`

## 1.3.4

### Patch Changes

- Updated dependencies [df2caa5]
  - @knime/styles@1.1.0
  - @knime/utils@1.0.17

## 1.3.3

### Patch Changes

- 80502ce: Add option to resize twinlist and the corresponding resize component

## 1.3.2

### Patch Changes

- 99dd829: fix formatting in ApiErrorTemplate

## 1.3.1

### Patch Changes

- c642514: Fix styling of indeterminate state of progress bar
- c642514: Export BreadcrumbItem type

## 1.3.0

### Minor Changes

- fad6298: Added a progress bar component that displays progress as a percentage, ensuring a minimum display of 1% and a maximum of 100%. It includes an indeterminate state, compact mode for a reduced height, and customizable tooltip support to enhance user experience and accessibility.

## 1.2.7

### Patch Changes

- 5beafff: Fix positioning/sizing of the FunctionButton. It caused a css glitch when
  the button was used inside the SplitButton component

## 1.2.6

### Patch Changes

- Updated dependencies
  - @knime/styles@1.0.11
  - @knime/utils@1.0.16

## 1.2.5

### Patch Changes

- 337e26b: Adjust color names to default color naming scheme
- Updated dependencies [337e26b]
  - @knime/styles@1.0.10
  - @knime/utils@1.0.15

## 1.2.4

### Patch Changes

- 7762ab2: minor improvements for api error template

## 1.2.3

### Patch Changes

- e63edc9: adjust size of FunctionButton on compact mode

## 1.2.2

### Patch Changes

- 7fe461f: make ApiErrorTemplate style scoped

## 1.2.1

### Patch Changes

- e114a57: Add InlineMessage component
- Updated dependencies [e114a57]
  - @knime/styles@1.0.9
  - @knime/utils@1.0.14

## 1.2.0

### Minor Changes

- 0fd52b2: add component prop to Toast interface to enable custom formatted toast content, update demo

## 1.1.10

### Patch Changes

- 89e6afa: Introduce opt-in features for making breadcrumbs usable without line breaks
- Updated dependencies [3e2c166]
  - @knime/styles@1.0.8
  - @knime/utils@1.0.13

## 1.1.9

### Patch Changes

- 2f39d7f: MenuItems: close submenu on esc key by registering @close event

## 1.1.8

### Patch Changes

- 4c5b04f: - Fix bug in TagList where the activeTags was always visible regardless of numberOfInitialTags.
  - Set height of Tag component to 24px to avoid different sizes for active and non active ones.

## 1.1.7

### Patch Changes

- bb78d4a: Add separator for slotted dropdown, and fix icon color for focused state

## 1.1.6

### Patch Changes

- 24fe1ac: Fix compact mode in Dropdown

## 1.1.5

### Patch Changes

- 0703852: Adjust keyboard navigation that was altered with the previous bump to @knime/components@1.1.4

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
