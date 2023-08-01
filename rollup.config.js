import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-ts";
import { terser } from "rollup-plugin-terser";

export default [
  {
    input: ["./src/index.ts"],
    output: [
      {
        dir: "./dist",
        format: "es",
        sourcemap: false,
        preserveModules: true,
      },
    ],
    plugins: [commonjs(), typescript()],
  },
  {
    input: ["./src/main.ts"],
    output: [
      {
        file: "./dist/knime-ui-extension-service.min.js",
        format: "iife",
        name: "KnimeUIExtensionService",
        plugins: [
          terser({
            /* eslint-disable camelcase */
            keep_classnames: true,
            keep_fnames: true,
            /* eslint-enable camelcase */
          }),
        ],
      },
      {
        file: "./dist/knime-ui-extension-service.dev.js",
        format: "iife",
        name: "KnimeUIExtensionService",
        plugins: [
          terser({
            output: {
              comments: "all",
            },
            mangle: false,
          }),
        ],
      },
    ],
    plugins: [commonjs(), typescript()],
  },
];
