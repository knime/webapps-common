import postcssConfig from '../webpack/webpack.postcss.config';
import svgConfig from '../webpack/webpack.svg.config';

import path from 'path';

export default {
    alias: {
        'webapps-common': path.resolve(__dirname, '..'),
        '../../../node_modules/@fontsource/roboto': path.resolve(__dirname, 'node_modules', '@fontsource/roboto'),
        '../../buildtools/opensourcecredits/used-packages.json': '../../demo/assets/used-packages-mock.json'
    },
    head: {
        title: 'KNIME WebApps Common',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ]
    },
    loading: false,
    css: [
        '~/assets/index.css'
    ],
    modules: [
        // this must be the first entry in the list
        '~/modules/server-logger'
    ],
    plugins: [
        '~/plugins/logger.client'
    ],
    build: {
        postcss: postcssConfig,
        extend(config, { isDev, isClient, isServer }) {
            // limit nuxt default image rule to raster images because we want to handle svg ourselves
            const svgRule = config.module.rules.find(rule => String(rule.test).includes('svg'));
            svgRule.test = new RegExp(String(svgRule.test).replace('svg|', '').replace('|svg', ''));
            
            config.module.rules.push(svgConfig);
        }
    },
    modern: 'client',
    router: {
        base: '/webapps-common/'
    },
    render: {
        bundleRenderer: {
            runInNewContext: false
        }
    }
};
