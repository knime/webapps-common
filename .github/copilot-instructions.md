# KNIME Webapps-Common Copilot Instructions

## Repository Overview

This is a **pnpm monorepo** containing shared frontend code for KNIME web projects. It includes Vue 3 components, TypeScript utilities, CSS styles, and JSON Forms integration. The repository publishes multiple npm packages under the `@knime` scope.

**Key Technologies:**

- **Node.js:** 22.x (specified in package.json engines)
- **Package Manager:** pnpm 10.18.1 (specified in packageManager field)
- **Language:** TypeScript, JavaScript (ES modules)
- **Framework:** Vue 3 (~3.5.18)
- **Build Tool:** Vite 7.x
- **Test Framework:** Vitest 3.2.4
- **Linting:** ESLint 9.38.0, Stylelint 16.23.0
- **Formatting:** Prettier 3.3.2

## Repository Structure

### Root Directory Files

- `package.json` - Root workspace configuration with scripts
- `pnpm-workspace.yaml` - Defines monorepo packages
- `eslint.config.js` - ESLint flat config
- `.stylelintrc.cjs` - Stylelint configuration
- `vitest.config.ts` - Root Vitest configuration
- `tsconfig.json` - TypeScript project references
- `sonar-project.properties` - SonarCloud configuration

### Packages (in packages/ directory)

1. **@knime/styles** - CSS variables, themes, icons (must build first)
2. **@knime/utils** - TypeScript utilities
3. **@knime/components** - Vue 3 components
4. **@knime/ui-extension-service** - UI extension service (builds to IIFE + ES modules)
5. **@knime/jsonforms** - JSON Forms integration (depends on components, styles, utils)
6. **@knime/rich-text-editor** - Rich text editing component
7. **@knime/virtual-tree** - Virtual tree component
8. **@knime/hub-features** - Hub-specific features
9. **@knime/ui-extension-renderer** - UI extension renderer
10. **@knime/lint** - ESLint/Stylelint configs and scripts
11. **@knime/licenses** - License checking utilities

### Demo Application

- Located in `demo/` directory
- Showcases all UI components
- Deployed to GitHub Pages at https://knime.github.io/webapps-common/

## Build Instructions

### Prerequisites

**CRITICAL:** You MUST use Node.js 22.x. Using Node 20.x will work but produces warnings that clutter output.

```bash
# Install pnpm globally if not available
npm install -g pnpm@10.18.1
```

### Initial Setup

**ALWAYS run these commands in this exact order:**

```bash
# 1. Install all dependencies (takes ~10-15 seconds)
pnpm install

# 2. Build styles package first (REQUIRED before other builds)
#    This generates CSS variable files that other packages import
pnpm run build:styles
```

**Why build:styles first?** The @knime/styles package generates CSS files (`knime-colors.css`, `nodes.css`, `ports.css`) that are imported by other packages. Without this step, builds will fail with missing file errors.

### Build Commands (in dependency order)

```bash
# Build individual packages (after build:styles)
pnpm run build:ui-extension-service  # Takes ~9-10 seconds
pnpm run build:jsonforms            # Takes ~25-30 seconds (largest package)

# Build all packages at once
pnpm run build:packages             # Takes ~35-40 seconds
# This runs: build:styles + build:ui-extension-service + build:jsonforms

# Build demo application
pnpm run build:demo                 # Takes ~10-12 seconds
# Note: build:packages must run first for demo to work
```

### Linting and Formatting

```bash
# Format code (uses Prettier cache)
pnpm run format                     # Fixes formatting issues

# Check formatting without fixing
pnpm run format:check              # Used in CI

# Lint JavaScript/TypeScript and CSS
pnpm run lint                      # Runs lint:js and lint:css with --fix

# Individual linting
pnpm run lint:js                   # ESLint with cache
pnpm run lint:css                  # Stylelint for CSS and Vue files

# CI lint (creates JSON reports)
pnpm run ci:lint-format            # Takes ~30-40 seconds
# This runs: build:styles + ci:lint:js + ci:lint:css + format:check
# Outputs: test-results/eslint.json, test-results/stylelint.json
```

**Important:** The `ci:lint-format` command builds styles first because stylelint needs the generated CSS variable files to validate custom properties.

### Type Checking

```bash
# Type check all packages
pnpm run type-check                # Takes ~5-10 seconds
# Uses vue-tsc with tsconfig.vitest.json
```

### Testing

```bash
# Run all unit tests
pnpm run test:unit                 # Takes ~130-140 seconds
# Uses Vitest, timezone set to 'Europe/Berlin'

# Run tests for specific packages
pnpm run test:unit-components
pnpm run test:unit-ui-extensions-renderer
pnpm run test:unit-jsonforms

# Run integration tests
pnpm run test:integration-jsonforms

# Run tests with coverage
pnpm run coverage                  # Runs coverage:unit + coverage:integration
pnpm run coverage:unit            # Takes ~130-140 seconds
pnpm run coverage:integration     # Only for jsonforms package

# Coverage output directories:
# - coverage/unit/lcov.info
# - coverage/integration/lcov.info
```

### Audit

```bash
# Check for security vulnerabilities in production dependencies
pnpm run audit                     # Takes ~5 seconds
```

### Demo Development

```bash
# Run demo locally (auto-builds styles)
cd demo
pnpm install
pnpm dev                           # Starts Vite dev server

# OR from root:
pnpm run demo                      # Builds packages then runs demo dev
```

## Complete CI Workflow (as run in GitHub Actions)

The CI workflow in `.github/workflows/ci.yml` runs these steps in order:

```bash
pnpm install
pnpm run ci:lint-format           # Includes build:styles
pnpm run build:ui-extension-service
pnpm run type-check
pnpm run coverage                 # Runs unit + integration tests with coverage
pnpm run build:packages
pnpm run build:demo
pnpm run audit
```

**Total CI time:** ~5-7 minutes

## Common Issues and Workarounds

### Node Version Warning

**Issue:** `WARN Unsupported engine: wanted: {"node":"22.x"} (current: {"node":"v20.19.5",...})`
**Solution:** Use Node.js 22.x. The repo requires Node 22 (see package.json engines). Node 20 will work but produces warnings.

### Missing CSS Variables Error

**Issue:** Stylelint or builds fail with errors about missing CSS custom properties
**Solution:** Always run `pnpm run build:styles` first. This generates the required CSS variable files.

### Clean Build

If you need a completely clean build:

```bash
# Remove all generated files
git clean -xdf packages/*/dist packages/styles/css/variables demo/dist node_modules coverage test-results

# Reinstall and rebuild
pnpm install
pnpm run build:styles
pnpm run build:packages
```

### Test Timezone

Tests use `TZ='Europe/Berlin'` timezone. This is set in the package.json test scripts. Don't remove this as date/time tests depend on it.

### Build Artifacts

Build outputs are in:

- `packages/*/dist/` - Compiled package output
- `demo/dist/` - Demo build for GitHub Pages
- `coverage/` - Test coverage reports
- `test-results/` - Lint reports (JSON)

These are all gitignored and should not be committed.

## Architecture and Code Layout

### Package Dependencies

```
@knime/styles (no dependencies)
    ↓
@knime/utils (no dependencies)
    ↓
@knime/components (depends on: styles, utils)
    ↓
@knime/rich-text-editor (depends on: components)
@knime/jsonforms (depends on: components, styles, utils, rich-text-editor)
@knime/ui-extension-service (standalone, builds to IIFE + ES)
@knime/ui-extension-renderer (depends on: ui-extension-service)
```

### Key Configuration Files

**TypeScript:**

- `tsconfig.json` - Project references root
- `tsconfig.app.json` - Application code config
- `tsconfig.vitest.json` - Test files config
- `tsconfig.node.json` - Node.js code (build scripts)
- `tsconfig.eslint.json` - ESLint TypeScript config

**Linting:**

- `eslint.config.js` - Root ESLint config (flat config format)
- `.stylelintrc.cjs` - Root Stylelint config
- `packages/lint/` - Contains shared KNIME ESLint/Stylelint presets

**Testing:**

- `vitest.config.ts` - Root Vitest config with coverage settings
- `packages/*/vitest.config.ts` - Package-specific configs

**Build:**

- `packages/*/vite.config.js` - Vite build configs for each package
- `demo/vite.config.ts` - Demo Vite config

### Git Hooks (Husky)

Two hooks are configured:

1. **pre-commit** - Runs lint-staged (lints and formats staged files)
2. **prepare-commit-msg** - Formats commit messages to KNIME standards (requires Atlassian API credentials)

Hooks are in `.husky/` directory and use nano-staged (config in `.nano-staged.js`).

## Changesets and Publishing

**For every PR, you MUST include a changeset:**

```bash
pnpm run changeset
# Follow prompts to select packages and change types
# Commit the generated .changeset/*.md file
```

The release workflow (`.github/workflows/release.yml`) automatically:

1. Creates a "Version Packages" PR when changesets are merged to master
2. Publishes to npm when that PR is merged

## Validation Steps

Before submitting changes, run:

```bash
# 1. Ensure styles are built
pnpm run build:styles

# 2. Lint and format
pnpm run ci:lint-format

# 3. Type check
pnpm run type-check

# 4. Run tests
pnpm run test:unit

# 5. Build packages
pnpm run build:packages

# 6. Build demo
pnpm run build:demo

# 7. Security audit
pnpm run audit
```

**Estimated total time:** ~7-10 minutes (similar to CI)

## Important Notes

1. **ALWAYS build @knime/styles first** - Other packages import its generated CSS
2. **Node 22.x required** - Package.json specifies "engines": {"node": "22.x"}
3. **Use pnpm, not npm/yarn** - This is a pnpm workspace
4. **Timezone matters** - Tests use TZ='Europe/Berlin'
5. **Demo ignores linting** - See eslint.config.js ignores: ["demo/*"]
6. **TODO comments** - Must include ticket ID (e.g., "TODO PROJECT-123:") or you'll get warnings
7. **Files with 500+ lines** - Will trigger max-lines warning
8. **Build scripts disabled** - pnpm shows warning about ignored build scripts (esbuild, unrs-resolver, vue-demi) - this is expected and safe

## Finding Code

**Components:** Look in `packages/components/src/components/` - organized by component name
**Composables:** In `packages/components/src/composables/`
**Utils:** In `packages/utils/src/`
**Styles:** In `packages/styles/css/` and `packages/styles/colors/`
**JSON Forms:** In `packages/jsonforms/src/` - organized by renderers, layouts, controls

**Tests:** Co-located with source files in `__tests__/` directories or as `.test.ts` files

## Trust These Instructions

These instructions have been validated by running all commands successfully. If you encounter behavior that differs from what's documented here, the issue is likely due to:

1. Wrong Node.js version
2. Skipping `pnpm run build:styles`
3. Missing dependencies (run `pnpm install`)
4. Stale build cache (try cleaning dist directories)

Only search for additional information if these instructions are incomplete or you find an error in them.
