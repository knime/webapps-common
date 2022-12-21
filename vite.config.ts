import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
// https://vitest.dev/config/
export default defineConfig({
    plugins: [vue(), svgLoader()],
    test: {
        include: ['**/__tests__/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        environment: 'jsdom',
        reporters: ['default', 'junit'],
        deps: { inline: ['consola'] },
        setupFiles: [
            fileURLToPath(new URL('vitest.setup.ts', import.meta.url))
        ],
        coverage: {
            all: true,
            exclude: [
                'demo/', 'lint/', 'buildtools/', 'install-subDependencies.js', 'coverage/**', 'dist/**',
                '**/*.d.ts', '**/__tests__/**', '**/*.config.{js,cjs,mjs,ts}',
                '**/.{eslint,prettier,stylelint}rc.{js,cjs,yml}'
            ]
        },
        outputFile: {
            junit: 'test-results/junit.xml' // needed for Bitbucket Pipeline, see https://support.atlassian.com/bitbucket-cloud/docs/test-reporting-in-pipelines/
        }
    }
});
