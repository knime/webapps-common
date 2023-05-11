/*
Example usage in Nuxt nuxt.config.js:
    import postcssConfig from 'webapps-common/webpack/webpack.postcss.config';
    export default {
        build: {
            postcss: postcssConfig
        }
    };

Example usage in Vue postcss.config.js:
    const { preset } = require('webapps-common/webpack/webpack.postcss.config');

    module.exports = {
        plugins: {
            'postcss-preset-env': preset
        }
    };
*/

module.exports = {
  preset: {
    // config for postcss-preset-env which converts modern CSS into something most browsers can understand
    stage: 2,
    features: {
      "nesting-rules": true,
    },
  },
  order: "presetEnvAndCssnanoLast",
  plugins: {
    "postcss-import": {},
    "postcss-url": {},
  },
};
