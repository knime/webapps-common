# @knime/licenses

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
