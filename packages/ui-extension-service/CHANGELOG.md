# @knime/ui-extension-service

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
