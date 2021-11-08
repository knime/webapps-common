import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import typescript from 'rollup-plugin-ts';

export default {
    input: ['./src/index.ts'],
    output: [
        {
            dir: './dist',
            format: 'es',
            sourcemap: false,
            preserveModules: true,
        },
    ],
    plugins: [
        commonjs(),
        typescript(),
        copy({
            targets: [
                {
                    src: 'package.json',
                    dest: 'dist',
                },
            ],
        }),
    ],
};
