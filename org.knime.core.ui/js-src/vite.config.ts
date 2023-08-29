import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import type { LibraryOptions } from 'vite';
import { loadEnv } from 'vite';

/**
 * NOTE: If you add a new library, make sure it is wrapped in a <div> with the
 * class `knime-ui-LIBNAME` where LIBNAME is the name you dfine in this object as key.
 *
 * See below how the CSS code is scoped in order to prevent problems with webapps-common in knime-ui.
 */
const libraries = {
    NodeDialog: {
        entry: fileURLToPath(new URL('./src/nodeDialog/NodeDialog.vue', import.meta.url)),
        name: 'defaultdialog',
        fileName: 'NodeDialog',
        formats: ['umd']
    } as LibraryOptions,
    TableView: {
        entry: fileURLToPath(new URL('./src/tableView/TableView.vue', import.meta.url)),
        name: 'tableview',
        fileName: 'TableView',
        formats: ['umd']
    } as LibraryOptions,
    DeferredTableView: {
        entry: fileURLToPath(new URL('./src/deferredTableView/DeferredTableView.vue', import.meta.url)),
        name: 'deferredtableview',
        fileName: 'DeferredTableView',
        formats: ['umd']
    } as LibraryOptions,
    TextView: {
        entry: fileURLToPath(new URL('./src/textView/TextView.vue', import.meta.url)),
        name: 'textview',
        fileName: 'TextView',
        formats: ['umd']
    } as LibraryOptions
};

const getCurrentLibrary = (mode: string) => {
    if (mode === 'NodeDialog' || mode === 'TableView' || mode === 'TextView' || mode === 'DeferredTableView') {
        return libraries[mode];
    }
    return false;
};

// https://vitest.dev/config/
export default defineConfig(({ mode }) => {
    const env = { ...process.env, ...loadEnv(mode, process.cwd()) };

    return {
        define: {
            'process.env': env // needed by v-calendar
        },
        plugins: [
            vue(),
            svgLoader(),
            cssInjectedByJsPlugin({
                styleId: 'knime-ui-table',
                injectCodeFunction: function injectCodeFunction(cssCode) {
                    try {
                        if (typeof document !== 'undefined') {
                            const elementStyle = document.createElement('style');
                            elementStyle.appendChild(document.createTextNode(cssCode));
                            document.head.prepend(elementStyle);
                        }
                    } catch (e) {
                        // eslint-disable-next-line no-console
                        console.error('vite-plugin-css-injected-by-js', e);
                    }
                }
            })
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
            emptyOutDir: false,
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
                    'buildtools/', 'coverage/**', 'dist/**', 'webapps-common/**', 'lib/**', '**/*.d.ts',
                    '**/__tests__/**', 'test-setup/**', '**/{vite,vitest,postcss}.config.{js,cjs,mjs,ts}',
                    '**/.{eslint,prettier,stylelint}rc.{js,cjs,yml}', '**/types/**'
                ],
                reporter: ['html', 'text', 'lcov']
            },
            outputFile: {
                junit: 'test-results/junit.xml' // needed for Bitbucket Pipeline, see https://support.atlassian.com/bitbucket-cloud/docs/test-reporting-in-pipelines/
            }
        },
        envPrefix: 'KNIME_'
    };
});
