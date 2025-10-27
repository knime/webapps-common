# @knime/licenses

## 1.3.4

### Patch Changes

- 6fcac18: Remove/replace `chalk` and `pkg-up` dependencies

## 1.3.3

### Patch Changes

- b6c2eb9: add repository link to package.json

## 1.3.2

### Patch Changes

- 4106e80: support root packages without name & version

## 1.3.1

### Patch Changes

- 73ea3a3: Correct DataType icon use for missing and path variables

## 1.3.0

### Minor Changes

- 0df972d: Dependency updates. Mostly relevant:

  - vite, vitest (and coverage reporter), vite-plugin-vue, vue-tsc
  - tiptap
  - vueuse/core

  Other improvements:

  - Updated license-checker to allow for Open Font License (OFL)
  - Updated svgo.config.d.ts to fix detection of svg config when supplying it to the vite-svg-loader plugin in vite.config files
  - Remove usages of interface in favor of type, when used in .vue; interfaces create multiple type issues when inferring props, etc which are likely caused by the declaration merging feature of interfaces.

## 1.2.0

### Minor Changes

- 493c9f0: TS improvements

## 1.1.1

### Patch Changes

- d21b6d6: Adding @netlify/binary-info to license exceptions (uses Apache-2.0)

## 1.1.0

### Minor Changes

- 1f2459e: update node version to node 22.11.0

## 1.0.6

### Patch Changes

- 3884dd2: handle packages without repository or license text

## 1.0.5

### Patch Changes

- 96ed6ae: Updated semver version to 6.3.1

## 1.0.4

### Patch Changes

- cf27a91: Fixed license checker failling on undefined values

## 1.0.3

### Patch Changes

- 57586d6: Breaking change: updated license exception for `npm-audit-resolver` to target version `3.0.0-RC.0`. Projects using older versions need to update to this one.

## 1.0.2

### Patch Changes

- a3a94cb: Added 'audit-resolve-core@3.0.0-3' to excluded packages on license checker
- aedb94f: Added esm-resolve to excluded packages from license check
- f8d099b: Added 'npm-audit-resolver@3.0.0-7' to excluded packages on license checker

## 1.0.1

### Patch Changes

- 4fe2143: Fix license-check bin script to also work in shell context

## 1.0.0

### Major Changes

- BREAKING CHANGE: Convert license checker to CLI tool to be referenced and called in individual projects only. See README.md for new usage.
