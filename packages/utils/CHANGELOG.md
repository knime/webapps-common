# @knime/utils

## 1.5.9

### Patch Changes

- Updated dependencies [8fc76a1]
  - @knime/styles@1.14.0

## 1.5.8

### Patch Changes

- Updated dependencies [712590e]
  - @knime/styles@1.13.0

## 1.5.7

### Patch Changes

- Updated dependencies [e06f88c]
  - @knime/styles@1.12.1

## 1.5.6

### Patch Changes

- Updated dependencies [95587b5]
  - @knime/styles@1.12.0

## 1.5.5

### Patch Changes

- 73ea3a3: Correct DataType icon use for missing and path variables
- Updated dependencies [73ea3a3]
  - @knime/styles@1.11.1

## 1.5.4

### Patch Changes

- Updated dependencies [0df972d]
  - @knime/styles@1.11.0

## 1.5.3

### Patch Changes

- Updated dependencies [51d4769]
  - @knime/styles@1.10.0

## 1.5.2

### Patch Changes

- Updated dependencies [11332fe]
  - @knime/styles@1.9.0

## 1.5.1

### Patch Changes

- Updated dependencies [88df4da]
  - @knime/styles@1.8.0

## 1.5.0

### Minor Changes

- 493c9f0: TS improvements

  - removed namespaces: UploadManagerNS
  - replaced any with fitting type or unknown/never

## 1.4.4

### Patch Changes

- Updated dependencies [8e21558]
  - @knime/styles@1.7.0

## 1.4.3

### Patch Changes

- Updated dependencies [04258bf]
  - @knime/styles@1.6.0

## 1.4.2

### Patch Changes

- 2a0a9fd: Add method to determine deep active element in shadow dom

## 1.4.1

### Patch Changes

- Updated dependencies [8e0a90a]
  - @knime/styles@1.5.0

## 1.4.0

### Minor Changes

- dea510f: Moved getMetaOrCtrlKey from navigator util to hotkeys util

## 1.3.3

### Patch Changes

- Updated dependencies [6e1501f]
  - @knime/styles@1.4.0

## 1.3.2

### Patch Changes

- bb186d1: add isWindows check to navigator utils

## 1.3.1

### Patch Changes

- a674c18: Allow zero duration but disallow empty duration in IntervalInput

## 1.3.0

### Minor Changes

- 59af778: Added a utility file for `hotkeys`. This utility can be used to detect if a modifier key is pressed or if the hotkey is pressed without any modifier keys. Additionally the `getMetaOrCtrlKey()` util was moved from `navigator` to the new `hotkeys` util.

## 1.2.7

### Patch Changes

- Updated dependencies [b10e3aa]
  - @knime/styles@1.3.1

## 1.2.6

### Patch Changes

- Adjust parameter signature for success/failure callbacks of upload feature

## 1.2.5

### Patch Changes

- Updated dependencies [976dba9]
  - @knime/styles@1.3.0

## 1.2.4

### Patch Changes

- Updated dependencies [ea2bc0b]
  - @knime/styles@1.2.0

## 1.2.3

### Patch Changes

- 4f06376: Add hub-specific processing state for for uploads

## 1.2.2

### Patch Changes

- 96ce3a3: Add util to get file name without extension

## 1.2.1

### Patch Changes

- d58ea81: Fix direct import to prevent typescript error

## 1.2.0

### Minor Changes

- 893d560: Add IntervalInput component for setting either date or time intervals

## 1.1.3

### Patch Changes

- 9fa8163: bugfix/improvements in uploads: retry only on server error, reset placeholder skeleton on prepare upload error

## 1.1.2

### Patch Changes

- 15a4479: add utilities for file extensions

## 1.1.1

### Patch Changes

- Updated dependencies
  - @knime/styles@1.1.1

## 1.1.0

### Minor Changes

- a8eebec: - Add `promise` utils
  - `retryPromise` util function to retry async calls
  - `createAbortablePromise` util function to leverage AbortControllers and
    add abort behavior to an async call
  - Add uploadManager util. Multi-file and multi-part upload handler

## 1.0.17

### Patch Changes

- Updated dependencies [df2caa5]
  - @knime/styles@1.1.0

## 1.0.16

### Patch Changes

- Updated dependencies
  - @knime/styles@1.0.11

## 1.0.15

### Patch Changes

- Updated dependencies [337e26b]
  - @knime/styles@1.0.10

## 1.0.14

### Patch Changes

- Updated dependencies [e114a57]
  - @knime/styles@1.0.9

## 1.0.13

### Patch Changes

- Updated dependencies [3e2c166]
  - @knime/styles@1.0.8

## 1.0.12

### Patch Changes

- Updated dependencies [9f80e7f]
  - @knime/styles@1.0.7

## 1.0.11

### Patch Changes

- Updated dependencies [1bec85f]
  - @knime/styles@1.0.6

## 1.0.10

### Patch Changes

- 0d185ea: address issue in subdependency
- Updated dependencies [0d185ea]
  - @knime/styles@1.0.5

## 1.0.9

### Patch Changes

- Updated dependencies [63f2b55]
  - @knime/styles@1.0.4

## 1.0.8

### Patch Changes

- Updated dependencies [15a0549]
  - @knime/styles@1.0.3

## 1.0.7

### Patch Changes

- Updated dependencies [4de967c]
  - @knime/styles@1.0.2

## 1.0.6

### Patch Changes

- 20b0b36: Export updateTime utility, type muteConsole

## 1.0.5

### Patch Changes

- Updated dependencies [63cf961]
  - @knime/styles@1.0.1

## 1.0.4

### Patch Changes

- a087e42: Specify `sideEffects: false` to allow for better tree shaking
- b2c9869: fix inconsistent consola versions

## 1.0.3

### Patch Changes

- 2d43ad8: Move svgWithTitle component from @knime/utils to @knime/components

## 1.0.2

### Patch Changes

- 45d2d81: Update navigator utils export name, because it conflicts with the native
  global property of the same name.

## 1.0.1

### Patch Changes

- 05c9114: refactor utils to TS
- 0c594bd: improve exports of utils package (related to hotkeys)
