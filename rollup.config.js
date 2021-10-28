import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import typescript from 'rollup-plugin-ts';

export default {
    input: ['./src/index.ts'],
    output: [
        {
            dir: './dist',
            format: 'es', // TODO clarify why this is needed to work in iframe base views; in general esmodules are good
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
