# @knime/components

## 1.41.5

### Patch Changes

- 4099706: Update vite and vueuse

## 1.41.4

### Patch Changes

- Updated dependencies [34a4517]
  - @knime/utils@1.7.0

## 1.41.3

### Patch Changes

- dae9c04: Hints: Do pointer-events: none on the arrow of a hint so users can interact with the element that it points to.

## 1.41.2

### Patch Changes

- f2ce76e: fix centering of checkbox in BaseMenuItem

## 1.41.1

### Patch Changes

- 4fa675a: fix submenu style issues

## 1.41.0

### Minor Changes

- 69ee640: add optional max height prop to SubMenu

## 1.40.1

### Patch Changes

- fd66ef6: Fix issue with click-outside in FileExplorer context-menu

## 1.40.0

### Minor Changes

- d394585: Added badge to MenuItem item component

## 1.39.4

### Patch Changes

- 2933ca3: Fix z-index for context menu. Close context menu on right-click outside to prevent positioning bugs

## 1.39.3

### Patch Changes

- 3b8b06f: FileExplorer: Fix bug introduced in 1.38.3 with the firefox bug workaround for drag & drop.

## 1.39.2

### Patch Changes

- a554e60: - fix type issue in FileExplorer when used in knime-ui

## 1.39.1

### Patch Changes

- 637189c: FileExplorer:

  - improve dynamic columns: allow customizable sizes via css variable for grid template
  - bug fix QA-1367 when the rename error appears at wrong positions

## 1.39.0

### Minor Changes

- 28c4851: FileExplorer: Add dynamic (dynamicColumn<NAME>) slot to allow any number of columns instead one (itemAppend). Add an options menu (three dots) at the end of the row which triggeres the context menu. Fix rename icon.

### Patch Changes

- Updated dependencies [28c4851]
  - @knime/styles@1.14.2
  - @knime/utils@1.6.2

## 1.38.8

### Patch Changes

- Updated dependencies [490ab62]
  - @knime/styles@1.14.1
  - @knime/utils@1.6.1

## 1.38.7

### Patch Changes

- Updated dependencies [a9b32f2]
  - @knime/utils@1.6.0

## 1.38.6

### Patch Changes

- 98b2ff5: Fix multi selection via drag in twinlist with data type icons

## 1.38.5

### Patch Changes

- e814867: FileExplorer component fixes

  - Fix issue where the sourceItems for the `onMove` event were being sent empty
    when the drag animation mode was "auto"
  - Fix issue where an empty folder was being displayed incorrectly (not taking the full height)
    when the `virtual` prop was used
  - Fix issue where the title attribute (aka tooltip) of the items were not showing due to a
    `pointer-events: none` declaration, which was needed for the dragging behavior
  - Fix issue where the text truncation via ellipsis of an item's text was not working correctly

## 1.38.4

### Patch Changes

- 8fc76a1: Update v-calendar, require @fontsource/roboto in version 5
- Updated dependencies [8fc76a1]
  - @knime/styles@1.14.0
  - @knime/utils@1.5.9

## 1.38.3

### Patch Changes

- 5e6e229: Fix bug in Firefox when dragging items in FileExplorer

## 1.38.2

### Patch Changes

- d17a4d3: Add itemAppend slot to FileExplorer to be able to add something to the item but also keep edit feature.

## 1.38.1

### Patch Changes

- feda14b: fix circular imports in components package

## 1.38.0

### Minor Changes

- 8794178: Add new SplitPane component

## 1.37.4

### Patch Changes

- Updated dependencies [712590e]
  - @knime/styles@1.13.0
  - @knime/utils@1.5.8

## 1.37.3

### Patch Changes

- Updated dependencies [e06f88c]
  - @knime/styles@1.12.1
  - @knime/utils@1.5.7

## 1.37.2

### Patch Changes

- Updated dependencies [95587b5]
  - @knime/styles@1.12.0
  - @knime/utils@1.5.6

## 1.37.1

### Patch Changes

- a771f90: Compacting the buttons in the SideDrawerControls

## 1.37.0

### Minor Changes

- 1b3973e: Added SideDrawerControls component

## 1.36.1

### Patch Changes

- 2fb809c: Fix SideDrawerHeader color

## 1.36.0

### Minor Changes

- c75b415: Added SideDrawerHeader component

## 1.35.1

### Patch Changes

- 73ea3a3: Correct DataType icon use for missing and path variables
- Updated dependencies [73ea3a3]
  - @knime/styles@1.11.1
  - @knime/utils@1.5.5

## 1.35.0

### Minor Changes

- e1c15d1: Add a default slot to InlineMessage.vue component and make the `description` prop optional.
  The `description` prop now serves as a fallback for the slot.

## 1.34.3

### Patch Changes

- 6e00414: Add data type icons to SortListControl

## 1.34.2

### Patch Changes

- 7fcf85b: Enable slots in Twinlist sub components
  Add DataType Icon to Jsonforms dropdowns and twinlists
  Adjust linting rule -> css imports now need the file extension

## 1.34.1

### Patch Changes

- 6887f7b: Explicitly export MenuItemsProps to resolve ts issues in library builds (e.g. table) which use the SubMenu and therefore implicitly use the MenuItemsProps.
  Remove warning when building jsonforms due to LoadingIcon referencing its own package.

## 1.34.0

### Minor Changes

- 0df972d: Dependency updates. Mostly relevant:

  - vite, vitest (and coverage reporter), vite-plugin-vue, vue-tsc
  - tiptap
  - vueuse/core

  Other improvements:

  - Updated license-checker to allow for Open Font License (OFL)
  - Updated svgo.config.d.ts to fix detection of svg config when supplying it to the vite-svg-loader plugin in vite.config files
  - Remove usages of interface in favor of type, when used in .vue; interfaces create multiple type issues when inferring props, etc which are likely caused by the declaration merging feature of interfaces.

### Patch Changes

- Updated dependencies [0df972d]
  - @knime/styles@1.11.0
  - @knime/utils@1.5.4

## 1.33.2

### Patch Changes

- 170b8d2: Flex grow rename input container in FileExplorer, so it fills the row.

## 1.33.1

### Patch Changes

- e7d2020: Replace useId by uuid to support vue versions < 3.5

## 1.33.0

### Minor Changes

- f9c2726: change escape listener for Modal from keyup to keydown

## 1.32.0

### Minor Changes

- 51d4769: Remove usages of the FunctionalComponent type for svg icon imports and replace it with the more proper Component type

### Patch Changes

- Updated dependencies [51d4769]
  - @knime/styles@1.10.0
  - @knime/utils@1.5.3

## 1.31.2

### Patch Changes

- Updated dependencies [11332fe]
  - @knime/styles@1.9.0
  - @knime/utils@1.5.2

## 1.31.1

### Patch Changes

- Updated dependencies [88df4da]
  - @knime/styles@1.8.0
  - @knime/utils@1.5.1

## 1.31.0

### Minor Changes

- 493c9f0: TS improvements

  - removed namespaces:
    - FileExplorerContextMenu
      - renamed MenuItem to FileExplorerMenuItem
  - replaced any with fitting type or unknown/never
  - use generic in DropdownControl.vue

### Patch Changes

- Updated dependencies [493c9f0]
  - @knime/utils@1.5.0

## 1.30.1

### Patch Changes

- Updated dependencies [8e21558]
  - @knime/styles@1.7.0
  - @knime/utils@1.4.4

## 1.30.0

### Minor Changes

- Fix and rename `FileExplorer`'s `clickOutsideExceptions` prop

  - Rename the `clickOutsideException` prop to `clickOutsideExceptions` to reflect that it takes multiple exceptions
  - Change the type of the mentioned prop to only allow an array of refs to HTML elements (it used to also allow a single, non-ref, HTML element) for consistency and code simplicity
  - Remove logic that turned a single element into an array of refs
  - Replace unnecessary usage of `useClickOutside` hook with a direct `onClickOutside` call

## 1.29.2

### Patch Changes

- Updated dependencies [04258bf]
  - @knime/styles@1.6.0
  - @knime/utils@1.4.3

## 1.29.1

### Patch Changes

- 2a0a9fd: Add method to determine deep active element in shadow dom
- Updated dependencies [2a0a9fd]
  - @knime/utils@1.4.2

## 1.29.0

### Minor Changes

- 5c1e0fa: Allow TabBar to contain a generic component supplied as part of its data

## 1.28.7

### Patch Changes

- Updated dependencies [8e0a90a]
  - @knime/styles@1.5.0
  - @knime/utils@1.4.1

## 1.28.6

### Patch Changes

- Debounce scrolling item into view in FileExplorer

## 1.28.5

### Patch Changes

- 64c9333: Adapt state provider logic to backend and change structure of validations

## 1.28.4

### Patch Changes

- 04ed897: Add disabled state for ComboBox and MultiSelect

## 1.28.3

### Patch Changes

- 33f0fa5: Fix remove tag button size in ComboBox

## 1.28.2

### Patch Changes

- 9757f66: Add disabled state for ListBox component

## 1.28.1

### Patch Changes

- 4b9650c: Add optional disabled state for items in File Explorer

  - which is styled to make it visually distinct
  - when keyboard navigating, disabled items are skipped
  - disabled items cannot be selected or opened, and have no context menu on right click

## 1.28.0

### Minor Changes

- 7b84a54: Change id generation in input components from global counter to useId

## 1.27.0

### Minor Changes

- e88dcfd: Rework interaction behaviour of date-time format picker to bring it in-line with date picker

  - There is a new selection state for keyboard navigation, so the currently applied format remains clearly visible at all times
  - Single-clicking applies a format and closes the popover (previously double-clicking was required)
  - `useDropdownNavigation` now exposes a `setElement` method, allowing to set a consistent dropdown state from outside. The `currentIndex` ref it exposes is now read-only

## 1.26.0

### Minor Changes

- 549a7f8: Introduce mulitple click away exceptions in file explorer

## 1.25.4

### Patch Changes

- 751cb18: Allow to override background colour of SideDrawer.vue via props

## 1.25.3

### Patch Changes

- dea510f: Moved getMetaOrCtrlKey from navigator util to hotkeys util
- Updated dependencies [dea510f]
  - @knime/utils@1.4.0

## 1.25.2

### Patch Changes

- e177076: fix(hints): auto-close hints when visibility becomes false after remote state sync

## 1.25.1

### Patch Changes

- a5c359f: add forgotten export for useAutoCloseOnCompletion composable

## 1.25.0

### Minor Changes

- 2d42337: add useAutoCloseOnCompletion composable that can be used with upload/download panel

## 1.24.2

### Patch Changes

- 6e1501f: add knar file icon
- Updated dependencies [6e1501f]
  - @knime/styles@1.4.0
  - @knime/utils@1.3.3

## 1.24.1

### Patch Changes

- 803a5b9: Changed default for showMode to true in MultiModeTwinlist

## 1.24.0

### Minor Changes

- 8582dc1: add character limits to ComboBox. Allow transparent attribute binding to TextArea (e.g to enable passing attrs like maxlength)

## 1.23.0

### Minor Changes

- 9ccf905: Allow button in SubMenu to be compact

## 1.22.2

### Patch Changes

- 93103f5: fix issue with thead element inside FileExplorer spanning whole page and causing an html overflow

## 1.22.1

### Patch Changes

- 4cc131a: fix TS errors

## 1.22.0

### Minor Changes

- ef010ff: added DownloadProgressPanel, added name input argument to useDownloadArtifact.start

## 1.21.1

### Patch Changes

- Updated dependencies [bb186d1]
  - @knime/utils@1.3.2

## 1.21.0

### Minor Changes

- 02c95c8: Allow hints to also support images

## 1.20.0

### Minor Changes

- 6c99c22: Add avatar component

## 1.19.4

### Patch Changes

- 5f3ca36: Further improve wording of apply button in Duration picker

## 1.19.3

### Patch Changes

- b30c0b8: Side Drawer widget now accepts CSS style overrides for width and position via prop

## 1.19.2

### Patch Changes

- a674c18: Allow zero duration but disallow empty duration in IntervalInput
- Updated dependencies [a674c18]
  - @knime/utils@1.3.1

## 1.19.1

### Patch Changes

- 0932714: Change wording of apply button in Duration picker

## 1.19.0

### Minor Changes

- 4aa2490: Remove prop to filter invalid selected values on possible value change

## 1.18.8

### Patch Changes

- replace GSAP with motion.dev

## 1.18.7

### Patch Changes

- 992a9e4: Make type in date&time format picker controllable

## 1.18.6

### Patch Changes

- 3fd06dd: Improved styling for toggleSwitch

## 1.18.5

### Patch Changes

- 59af778: Prevent dropdown from opening when Ctrl or any modifier key is pressed with Enter using new hotkeys util.
- Updated dependencies [59af778]
  - @knime/utils@1.3.0

## 1.18.4

### Patch Changes

- Updated dependencies [b10e3aa]
  - @knime/styles@1.3.1
  - @knime/utils@1.2.7

## 1.18.3

### Patch Changes

- Adjust parameter signature for success/failure callbacks of upload feature
- Updated dependencies
  - @knime/utils@1.2.6

## 1.18.2

### Patch Changes

- fix toast height breaking the expand animation

## 1.18.1

### Patch Changes

- 3141407: Add option to clear invalid values from searchable checkboxes when the possible values change

## 1.18.0

### Minor Changes

- 976dba9: Added css variable to change modal color

### Patch Changes

- Updated dependencies [976dba9]
  - @knime/styles@1.3.0
  - @knime/utils@1.2.5

## 1.17.0

### Minor Changes

- 1f2459e: update node version to node 22.11.0

## 1.16.1

### Patch Changes

- fd95605: Remove set format button from date time picker

## 1.16.0

### Minor Changes

- de31f24: `ToastService.show()`: rename `key` to `deduplicationKey` and remove `id` (does get auto-generated)

## 1.15.6

### Patch Changes

- fix TS issues:
  these were showing up in other consuming projects that have stricter ts configs

## 1.15.5

### Patch Changes

- e392961: Version bump of v-calendar in the pnpm-lock which should have been part of a previous version bump

## 1.15.4

### Patch Changes

- ec12810: Replace v-calendar npm dep version with git url

## 1.15.3

### Patch Changes

- c1bb1a7: fix rare TabBar state SSR/CSR hydration issues

## 1.15.2

### Patch Changes

- f94dddb: Handle async components to allow reactivity while wrapping in higher order components

## 1.15.1

### Patch Changes

- 03f69d0: Limit scrollIntoView behavior to vertical scrolling.

## 1.15.0

### Minor Changes

- ea2bc0b: Add DateTimeFormatInput component.

### Patch Changes

- Updated dependencies [ea2bc0b]
  - @knime/styles@1.2.0
  - @knime/utils@1.2.4

## 1.14.0

### Minor Changes

- eabff98: FileExplorer: Add "virtual" prop to enable virtual scrolling for enhanced performance with large amounts of items.

## 1.13.1

### Patch Changes

- 4f06376: Add hub-specific processing state for for uploads
- Updated dependencies [4f06376]
  - @knime/utils@1.2.3

## 1.13.0

### Minor Changes

- 1787fe5: allow dynamic height for tags to prevent overlap in TagList

## 1.12.3

### Patch Changes

- Updated dependencies [96ce3a3]
  - @knime/utils@1.2.2

## 1.12.2

### Patch Changes

- 7765daf: add max-height to UploadProgressPanel, make it scrollable on overflow

## 1.12.1

### Patch Changes

- d58ea81: Fix direct import to prevent typescript error
- Updated dependencies [d58ea81]
  - @knime/utils@1.2.1

## 1.12.0

### Minor Changes

- 893d560: Add IntervalInput component for setting either date or time intervals

### Patch Changes

- Updated dependencies [893d560]
  - @knime/utils@1.2.0

## 1.11.1

### Patch Changes

- 9fa8163: bugfix/improvements in uploads: retry only on server error, reset placeholder skeleton on prepare upload error
- Updated dependencies [9fa8163]
  - @knime/utils@1.1.3

## 1.11.0

### Minor Changes

- 5b0167e: - Add SkeletonItem component.
  - Remove ApiErrorToast template

## 1.10.0

### Minor Changes

- c0fc6a3: Removed LegacyBrowserWarning

## 1.9.3

### Patch Changes

- 14cc92c: remove clickoutside to dismiss behavior for hints

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
