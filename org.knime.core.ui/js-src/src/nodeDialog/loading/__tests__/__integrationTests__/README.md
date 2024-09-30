# Testing Loading Dialog Behavior

## Why Are There Two Test Files?

In this folder, we have two separate test files with identical test setup:

- [`loading-dialog-fast.test.ts`](./loading-dialog-fast.test.ts)
- [`loading-dialog-slow.test.ts`](./loading-dialog-slow.test.ts)

### Reason for Splitting the Tests

When running the test in one file, they interfere with each other because they depend on dynamic imports being loaded.

Using `vi.resetModules()` to dynamically mock and test different loading times (fast vs. slow) by clearing the module cache between tests would ensure that dynamic imports are reloaded and mocked fresh for each test.

However, calling `resetModules()` globally or between tests introduces a problem: It also resets shared state, such as `provide`/`inject` setups that rely on `Symbols`. Since Symbols are used for dependency injection and state sharing across components, resetting the entire module cache disrupts the injection system and breaks the tests. Instead of relying on `resetModules()`, we opt to split the tests into separate files to avoid the caching issues without resetting the entire module state.
