# @knime/ui-extension-service

## 1.0.1

### Patch Changes

- 29856fd: Add push event for whether the data value view is open or closed

## 1.0.0

### Major Changes

- 86327c6: Moved ui-extension-service to webapps-common monorepo setup
  BREAKING CHANGE: The iife builds need to be imported from `@knime/ui-extension-service/iife` now (or `iifeDev` respectively).

### Patch Changes

- 9d19c8a: Remove canBeEnlarged and add startEnlarged property to UIExtensionServiceConfig
