module.exports = {
    extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
    rules: {
        'color-no-hex': true,
        'custom-property-empty-line-before': null,
        'declaration-colon-newline-after': null,
        'no-empty-source': null,
        'property-no-unknown': [true, {
            // at the time of writing, content-visibility is only supported in Chrome,
            // but doesn't cause any harm elsewhere
            ignoreProperties: ['content-visibility']
        }],
        'selector-nested-pattern': '^&',
        'selector-type-case': ['lower', {
            ignoreTypes: [
                'altGlyph', 'altGlyphDef', 'altGlyphItem', 'animateColor', 'animateMotion', 'animateTransform',
                'clipPath', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix',
                'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feDropShadow', 'feFlood', 'feFuncA',
                'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology',
                'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence',
                'foreignObject', 'glyphRef', 'linearGradient', 'radialGradient', 'textPath'
            ]
        }],
        'value-list-comma-newline-after': null
    }
};
