import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue({
        template: {
            compilerOptions: {
                compatConfig: {
                    MODE: 2
                }
            }
        }
    }), svgLoader()],
    resolve: {
        alias: {
            vue: '@vue/compat',
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@@': fileURLToPath(new URL('.', import.meta.url)), // I believe this is 'more standard' than to define individual imports for submodules
            '~': fileURLToPath(new URL('.', import.meta.url)) // only needed for import statements in webapps-common
        }
    },
    envPrefix: 'KNIME_',
    server: {
        fs: {
            // Allow serving files from one level up to the project root
            allow: ['..']
        }
    }
});
