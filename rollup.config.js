import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import typescript from 'rollup-plugin-ts';
import { terser } from 'rollup-plugin-terser';

export default [{
    input: ['./src/index.ts'],
    output: [
        {
            dir: './dist',
            format: 'es',
            sourcemap: false,
            preserveModules: true
        }
    ],
    plugins: [
        commonjs(),
        typescript(),
        copy({
            targets: [
                {
                    src: 'package.json',
                    dest: 'dist'
                }
            ]
        })
    ]
}, {
    input: ['./src/main.ts'],
    output: [
        {
            file: './dist/knime-ui-extension-service.min.js',
            format: 'iife',
            name: 'KnimeUIExtensionService'
        }
    ],
    plugins: [
        commonjs(),
        typescript(),
        terser({
            output: {
                comments: 'all'
            },
            mangle: false
        })
    ]
}];
