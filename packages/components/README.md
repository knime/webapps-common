# ![Image](https://www.knime.com/sites/default/files/knime_logo_github_40x40_4layers.png) @knime/components

This project contains Vue components & composables, that can be used for the frontend of all KNIME web projects.

## Demo

A demo of all contained UI components, icons, CSS colors etc. can be found here:
https://knime.github.io/webapps-common/?

## Installation

To install the `@knime/components` package, you can use npm:

```bash
npm install @knime/components
```

## Usage

To use it in your project, you can import it as follows:

#### Components

```javascript
import { DonutChart } from "@knime/components";
```

or import types as follow:

```typescript
import type { MenuItem } from "@knime/components";
```

#### Composables

```javascript
import { useClickOutside } from "@knime/components";
```

### Nuxt

Additional requirements when used with Nuxt:

- Nuxt-native `ClientOnly` and `NuxtLink` components need to be registered globally,
  otherwise they can't get resolved in [`ui/util/nuxtComponentResolver.js`](ui/util/nuxtComponentResolver.js)

### Stacking order and z-index

Try to avoid setting z-indices since they can lead to stacking conflicts, especially when shared components are used in many different apps. Many times a `z-index` is not needed, e.g. [elements which use `position: absolute;` are stacked on top](Stacking) anyway. Additionally, the local stacking order can be controlled by changing the order in the DOM or using `::after` instead of `::before` pseudo elements.

When the above doesn’t work and you need a `z-index`, think about

- if you just want to stack things locally. If yes, set `isolation: isolate;` on the parent element so you don’t pollute the global stacking context.
- if it needs to be in the global context and the code you’re editing is in webapps-common, use a CSS variable with default like `z-index: var(--z-index-common-modal, 100);` so our apps can overwrite it if needed. To see which are available in the shared components, search for `--z-index-common-` in this repository.

# Join the Community!

- [KNIME Forum](https://forum.knime.com/)

[PostCSS]: https://postcss.org/
[postcss-nesting]: https://github.com/jonathantneal/postcss-nesting
[CSS Nesting specification]: https://tabatkins.github.io/specs/css-nesting/#nest-selector
