/*
Example usage in Nuxt nuxt.config.js:
    import postcssConfig from '~/webapps-common/webpack/webpack.postcss.config';
    export default {
        build: {
            postcss: postcssConfig
        }
    };

Example usage in Vue postcss.config.js:
    const { preset, plugins, order } = require('webapps-common/webpack/webpack.postcss.config');
    module.exports = {
        plugins: Object.assign({}, plugins, {
            'postcss-preset-env': preset
        }),
        order
    };
*/

module.exports = {
    preset: { // config for postcss-preset-env which converts modern CSS into something most browsers can understand
        stage: 2,
        features: {
            'nesting-rules': true,
            // only because of IE11: the 'custom-properties' plugin doesn't support pseudo elements and
            // only the :root scope, so we'll use 'postcss-css-variables'
            'custom-properties': false
        }
    },
    order: 'presetEnvAndCssnanoLast',
    plugins: {
        'postcss-import': {},
        'postcss-url': {},
        'postcss-css-variables': { // only because of IE11: add fallbacks for css custom properties
            preserve: true // ...but keep native CSS custom props, so modern browser will use them
        },
        'postcss-calc': {}
    }
};
