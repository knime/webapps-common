const { preset } = require('./webpack/webpack.postcss.config');

module.exports = {
    plugins: {
        'postcss-preset-env': preset
    }
};
