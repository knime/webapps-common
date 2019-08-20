# KNIME Icons

Most SVG icons have an original size of 32x32px. In order to achieve consistent stroke-widths when scaling them, use the
following CSS:
```css
svg {
  width: 12px;
  height: 12px;
  stroke-width: calc(32px / 12);
}
```
…replacing 12 with the desired display size.

(In the future the above syntax could be simplified using CSS variables, but IE11 does not support this, and neither does the
fallback plugin: `:root{svg{width:calc(var(--icon-size)*1px);height:calc(var(--icon-size)*1px);stroke-width:calc(32px/var(--icon-size));}}`)

Use the [`svgWithTitle`](../../../components/svgWithTitle.js) module to add a tooltip to the SVG.
