const { preset } = require("webapps-common/config/postcss.config");

module.exports = {
  plugins: {
    "postcss-mixins": {},
    "postcss-preset-env": preset,
  },
};
