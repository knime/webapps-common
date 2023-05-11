module.exports = {
    extends: ['stylelint-config-standard-vue'],
    rules: {
        'rule-empty-line-before': ['always-multi-line', {
          except: ['first-nested'],
          ignore: ['after-comment']
        }],
        'color-no-hex': true,
        'custom-property-empty-line-before': null,
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
        }]
    }
};

