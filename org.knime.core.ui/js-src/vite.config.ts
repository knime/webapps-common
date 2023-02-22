import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import type { LibraryOptions } from 'vite';

const libraries = {
    NodeDialog: {
        entry: fileURLToPath(new URL('./src/nodeDialog/NodeDialog.vue', import.meta.url)),
        name: 'DefaultNodeDialog',
        fileName: 'NodeDialog',
        formats: ['umd']
    } as LibraryOptions,
    TableView: {
        entry: fileURLToPath(new URL('./src/tableView/TableView.vue', import.meta.url)),
        name: 'DefaultNodeDialog',
        fileName: 'TableView',
        formats: ['umd']
    } as LibraryOptions
};

const getCurrentLibrary = (mode: string) => {
    if (mode !== 'NodeDialog' && mode !== 'TableView') {
        return false;
    }
    return libraries[mode];
};


// https://vitejs.dev/config/
// https://vitest.dev/config/
export default defineConfig(({ mode }) => ({
    plugins: [
        vue(),
        svgLoader(),
        cssInjectedByJsPlugin() // not supported natively in Vite yet, see https://github.com/vitejs/vite/issues/1579]
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@@': fileURLToPath(new URL('.', import.meta.url))
        },
        dedupe: [
            'vue' // see https://github.com/vuejs/core/issues/4344#issuecomment-899064501
        ]
    },
    build: {
        lib: getCurrentLibrary(mode),
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {
                    vue: 'Vue' // maps to window.Vue which must be provided by the consuming app
                }
            }
        }
    },
    test: {
        include: ['src/**/__tests__/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        environment: 'jsdom',
        reporters: ['default', 'junit'],
        deps: { inline: ['consola'] },
        setupFiles: [
            fileURLToPath(new URL('test-setup/vitest.setup.js', import.meta.url))
        ],
        coverage: {
            all: true,
            exclude: [
                'buildtools/', 'coverage/**', 'dist/**', 'webapps-common/**', 'lib/**', '**/*.d.ts', '**/__tests__/**',
                'test-setup/**', '**/{vite,vitest,postcss}.config.{js,cjs,mjs,ts}',
                '**/.{eslint,prettier,stylelint}rc.{js,cjs,yml}'
            ]
        },
        outputFile: {
            junit: 'test-results/junit.xml' // needed for Bitbucket Pipeline, see https://support.atlassian.com/bitbucket-cloud/docs/test-reporting-in-pipelines/
        }
    },
    envPrefix: 'KNIME_'
}));
