const { preset } = require("./config/postcss.config");

module.exports = {
  plugins: {
    "postcss-preset-env": preset,
  },
};
