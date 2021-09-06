/*
Custom image rule for SVGs including optimization (inspired by https://github.com/sam3d/nuxt-svg)

Example usage in Nuxt nuxt.config.js:
    import svgConfig from '~/webapps-common/webpack/webpack.svg.config';
    export default {
        build: {
            extend(config) {
                // remove Nuxt's default svg loader
                const svgRule = config.module.rules.find(rule => String(rule.test).includes('svg'));
                svgRule.test = new RegExp(String(svgRule.test).replace('svg|', '').replace('|svg'));

                // add our svg loader
                config.module.rules.push(svgConfig);
            }
        }
    };

Example usage in Vue postcss.config.js:
    const svgConfig = require('webapps-common/webpack/webpack.svg.config');
    module.exports = {
        chainWebpack: config => {
            config.module.rule('svg').uses.clear();
            config.merge({ module: { rule: { svg: svgConfig } } });
        }
    };
*/

const svgoOptions = {
    plugins: [
        { convertShapeToPath: false }
    ]
};

module.exports = {
    test: /\.svg$/i,
    oneOf: [{
        resourceQuery: /\?inline$/,
        use: [{
            loader: 'vue-svg-loader',
            options: {
                svgo: svgoOptions
            }
        }]
    }, {
        resourceQuery: /\?data$/,
        use: [{
            loader: 'url-loader'
        }, {
            loader: 'svgo-loader',
            options: svgoOptions
        }]
    }, {
        use: [{
            loader: 'file-loader?name=img/[name].[hash:7].[ext]',
            options: {
                esModule: false
            }
        }, {
            loader: 'svgo-loader',
            options: svgoOptions
        }]
    }]
};
