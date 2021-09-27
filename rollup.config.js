import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import typescript from '@rollup/plugin-typescript';

export default {
    input: ['./src/index.ts'],
    output: [
        {
            dir: './dist',
            format: 'cjs',
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
};
