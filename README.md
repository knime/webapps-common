# Shared files for web projects with JS, Vue and/or Nuxt

This project contains shared config files, Vue components, CSS files, utilities, etc. that can be used for the frontend
of all KNIME web projects. It also includes an internal NPM package, knime-build-tools, which contains scripts and functionality
commonly used in KNIME web projects.

## Demo

Run
```sh
npm run demo
```

to see the included components.

## Usage

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

    The latter allows to require the files via `require('webapps-common')` as if they had been pulled from the npm
    registry, as opposed to writing `require('{RELATIVE_PATH}/webapps-common')`.  
    It also warns you about installing required [peer dependencies].
   
1. Now set up an alias for the `webapps-common` folder:

    ```js
    // nuxt.config.js
    import path from 'path';
    export default {
        alias: {
            'webapps-common': path.resolve(__dirname, 'webapps-common')
        }
    }
    ```

    This is required for importing assets via `<img src="…">` in Vue templates and `url("…")` in CSS.

### Vue

This project contains shared CSS files and Vue components.

Depending on the use case, you must follow a different syntax to import the common files:

#### `~/webapps-common/…`

This can be used when importing js files or SVG images into a `.vue` file:

```js
import DownloadIcon from '~/webapps-common/ui/assets/img/icons/cloud-download.svg?inline'; // inline SVG
import svgWithTitle from '~/webapps-common/ui/util/svgWithTitle'; // .js
import Description from '~/webapps-common/ui/components/Description'; // Vue component
```

The Vue components expect that the app provides the following:

- Vue and Consola compatible to the versions defined in [`package.json`](package.json)
- global `window.consola` instance for logging

#### `~webapps-common/…`

This is used for loading resources in templates or CSS:

```html
<img src="~webapps-common/ui/assets/img/KNIME_Logo_gray.svg">
```

```css
.foo {
    mask: url("~webapps-common/ui/assets/img/icons/link-external.svg?data") no-repeat 50% 50%; /* inline SVG as base64 */
}
```

(this also works for `.js` imports)

#### `webapps-common/`

This syntax can be used for importing CSS files from within other CSS files:

```css
@import "webapps-common/ui/css/grid";
```

(the `~/` syntax also works, except for fonts)

#### overview

|                 | `~/webapps-common/` | `~webapps-common/` | `webapps-common/` |
| --------------- |:-------------------:|:------------------:|:-----------------:|
| import Vue      | ✅                   | ✅                  |                   |
| import JS       | ✅                   | ✅                  | (no Babel)        |
| import SVG      | ✅                   |                    |                   |
| `<img src="…">` |                     | ✅                  |                   |
| CSS `url()`     |                     | ✅                  |                   |
| CSS `@import`   | (not for fonts)     |                    | ✅                 |



### ESLint

Include this in your [ESLint config file]:

```js
{
  extends: ['./webapps-common/lint/.eslintrc-base.js']
}
```

Use `.eslintrc-nuxt.js` for nuxt.js projects, `eslintrc-vue.js` for Vue.js projects, `.eslintrc-legacy.js`
for legacy views (KNIME AP, ES3), and`.eslintrc-base.js` for other projects.

Configuration files are made for ESLint 5.

### stylelint

Import the config file using

```
module.exports = require('webapps-common/lint/.stylelintrc');
```

in your `.stylelintrc.js`.

Configuration files are made for Stylelint 10.

### webpack

(see inline comments in `webpack/*`)

## Styling and theming

### CSS tooling and syntax

The KNIME color scheme is defined in JavaScript and has to be converted into CSS by running

```sh
npm run generate-css
```

This is done automatically on `postinstall`.

Other JS-defined colors are:

- Node Background Colors

All other CSS is written in (future) CSS syntax and pre-processed by [PostCSS], see [`webpack/webpack.postcss.config.js`](webpack/webpack.postcss.config.js).


### Theming
In the future, custom theming can be supported by overwriting the theme CSS custom properties defined in
`/ui/css/variables`. Since IE11 doesn't support them, theming won't work here; the default theme will be shown.

# knime-build-tools

see `/buildtools/README.md`





[PostCSS]: https://postcss.org/
[postcss-nesting]: https://github.com/jonathantneal/postcss-nesting
[CSS Nesting specification]: https://tabatkins.github.io/specs/css-nesting/#nest-selector
[ESLint config file]: https://eslint.org/docs/user-guide/configuring
[peer dependencies]: https://docs.npmjs.com/files/package.json#peerdependencies
