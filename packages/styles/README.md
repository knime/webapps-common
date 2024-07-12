# ![Image](https://www.knime.com/sites/default/files/knime_logo_github_40x40_4layers.png) @knime/styles

Internal style definitions, config, base CSS, icons and images shared across `@knime` packages.

## Demo

A demo of all contained UI components, icons, CSS colors etc. can be found here:
https://knime.github.io/webapps-common/?tab=images

## Installation

To install the `@knime/styles` package, you can use npm:

```bash
npm install @knime/styles
```

## Usage

To use it in your project, you can import it as follows:

### Icons

```javascript
import ImageIcon from "@knime/styles/img/icons/media-image.svg";
```

NOTE: You will need to have the image extension at the end of the path

### CSS

```
@import "@knime/styles/css";
```

### Images

```html
<img src="~@knime/styles/img/KNIME_Logo_gray.svg" />
```

### Config

```
import @knime/styles/config/svg.d.ts
```

### Color

```javascript
import * as $colors from "@knime/styles/colors/knimeColors";
```

## Styling

---

### KNIME color scheme

The KNIME color scheme is defined in JavaScript and has to be converted into CSS by running

```sh
npm run generate-css
```

This is done automatically on `pnpm install`, but needs to be run manually after changing any of the `colors/*` files.

Other JS-defined colors are:

- Node Background Colors

### Theming

Custom theming can be supported by overwriting the theme CSS custom properties defined in `/css/variables`.

# SVG-Style-Guidelines

- [SVG Guideline](documentation/SVG-Style-README.md)

# Join the Community!

- [KNIME Forum](https://forum.knime.com/)
