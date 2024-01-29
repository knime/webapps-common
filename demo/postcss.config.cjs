const { preset } = require("webapps-common/config/postcss.config.cjs");

module.exports = {
  plugins: {
    "postcss-mixins": {},
    "postcss-preset-env": preset,
  },
};
