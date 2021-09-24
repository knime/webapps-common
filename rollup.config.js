import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';

export default {
    input: ['./src/index.js'],
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
