/**
 * @typedef {import('svgo').Config} Config
 *
 * @type {Config}
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
