# ![Image](https://www.knime.com/sites/default/files/knime_logo_github_40x40_4layers.png) @knime/styles

Internal style definitions, config, base CSS, icons and images shared across `@knime` packages.

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
import * as $colors from "@knime/styles/colors/knimeColors.mjs";
```

# Join the Community!

- [KNIME Forum](https://forum.knime.com/)
