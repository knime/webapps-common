/**
 * @typedef {import('./svgo.config').SvgoConfig} SvgoConfig
 *
 * @type {SvgoConfig}
 */
const svgoConfig = {
  plugins: [
    {
      name: "preset-default",
      params: {
        overrides: {
          // disable converting lines to paths as it breaks our 'dots' and might also introduce stroke-width attributes
          convertShapeToPath: false,
        },
      },
    },
  ],
};

export { svgoConfig };
