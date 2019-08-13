/*
Example usage in Nuxt nuxt.config.js:
    import postcssConfig from 'webapps-common/webpack/webpack.postcss.config';
    export default {
        build: {
            postcss: postcssConfig
        }
    };

Example usage in Vue postcss.config.js:
    const { preset, plugins } = require('webapps-common/webpack/webpack.postcss.config');
    module.exports = {
        plugins: Object.assign({}, plugins, {
            'postcss-preset-env': preset
        })
    };
*/

module.exports = {
    preset: {
        stage: 2,
        features: {
            'nesting-rules': true,
            // only because of IE11: the 'custom-properties' plugin doesn't support pseudo elements and
            // only the :root scope, so we'll use 'postcss-css-variables'
            'custom-properties': false
        }
    },
    plugins: {
        'postcss-css-variables': { // only because of IE11: add fallbacks for css custom properties
            preserve: true // ...but keep native CSS custom props, so modern browser will use them
        },
        'postcss-calc': true
    }
};
