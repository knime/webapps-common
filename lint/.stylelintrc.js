module.exports = {
    extends: 'stylelint-config-standard',
    rules: {
        'color-no-hex': true,
        'custom-property-empty-line-before': null,
        'declaration-colon-newline-after': null,
        'max-empty-lines': 2,
        'no-empty-source': null,
        'selector-nested-pattern': '^&',
        'value-list-comma-newline-after': null,
        'selector-type-case': ['lower', {
            ignoreTypes: [
                'altGlyph', 'altGlyphDef', 'altGlyphItem', 'animateColor', 'animateMotion', 'animateTransform',
                'clipPath', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix',
                'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feDropShadow', 'feFlood', 'feFuncA',
                'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology',
                'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence',
                'foreignObject', 'glyphRef', 'linearGradient', 'radialGradient', 'textPath'
            ]
        }]
    }
};
