const { preset } = require("@knime/styles/config/postcss.config.cjs"); // eslint-disable-line import/extensions

module.exports = {
  plugins: {
    "postcss-mixins": {},
    "postcss-preset-env": preset,
  },
};
