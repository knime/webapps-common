/*
Example usage in Vue postcss.config.js:
    const { preset } = require('webapps-common/config/postcss.config');

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
};
