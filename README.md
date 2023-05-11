# ![Image](https://www.knime.com/files/knime_logo_github_40x40_4layers.png) KNIME® Webapps-Common

## Shared files for KNIME® web projects with JS, Vue and/or Nuxt

This project contains shared config files, Vue components, CSS files, utilities, etc. that can be used for the frontend
of all KNIME web projects. It also includes an internal NPM package, knime-build-tools, which contains scripts and functionality
commonly used in KNIME web projects.

## Demo

A demo of all contained UI components, icons, CSS colors etc. can be found here:
https://knime.github.io/webapps-common/

Same application also serves as a development environment (code lives in `demo` folder) and can be run locally by calling

```sh
npm run dev
```

## Usage

---

You should follow these steps

1. include this project as a [git submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
1. add it as an npm dependency:

   ```json
   {
     "devDependencies": {
       "webapps-common": "file:webapps-common"
     }
   }
   ```

   The latter allows to import the files via `import {} from 'webapps-common'` as if they had been pulled from the npm
   registry, as opposed to using relative paths.

Alternativly, more and more parts are also published as [npm packages](https://www.npmjs.com/~knime) and can be used without git submodules.

## Vue

---

The Vue components expect that the app provides the following:

- Vue and Consola compatible to the versions defined in [`package.json`](package.json)
- global `window.consola` instance for logging
- [PostCSS] configuration as described in [`webpack/webpack.postcss.config.js`](webpack/webpack.postcss.config.js).

## Styling

---

### KNIME color scheme

The KNIME color scheme is defined in JavaScript and has to be converted into CSS by running

```sh
npm run generate-css
```

This is done automatically on `npm install`, but needs to be run manually after changing any of the `ui/colors/*` files.

Other JS-defined colors are:

- Node Background Colors

### Stacking order and z-index

Try to avoid setting z-indices since they can lead to stacking conflicts, especially when shared components are used in many different apps. Many times a `z-index` is not needed, e.g. [elements which use `position: absolute;` are stacked on top](Stacking) anyway. Additionally, the local stacking order can be controlled by changing the order in the DOM or using `::after` instead of `::before` pseudo elements.

When the above doesn’t work and you need a `z-index`, think about

- if you just want to stack things locally. If yes, set `isolation: isolate;` on the parent element so you don’t pollute the global stacking context.
- if it needs to be in the global context and the code you’re editing is in webapps-common, use a CSS variable with default like `z-index: var(--z-index-common-modal, 100);` so our apps can overwrite it if needed. To see which are available in the shared components, search for `--z-index-common-` in this repository.

### Theming

Custom theming can be supported by overwriting the theme CSS custom properties defined in `/ui/css/variables`.

# knime-build-tools

A helper module for build specific utilities. For more details, see `/buildtools/README.md`.

# SVG-Style-Guidelines

- [SVG Guideline](documentation/SVG-Style-README.md)

# Join the Community!

- [KNIME Forum](https://forum.knime.com/)

[PostCSS]: https://postcss.org/
[postcss-nesting]: https://github.com/jonathantneal/postcss-nesting
[CSS Nesting specification]: https://tabatkins.github.io/specs/css-nesting/#nest-selector
[Stacking]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/Stacking_without_z-index
