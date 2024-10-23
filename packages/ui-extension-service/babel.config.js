module.exports = {
  presets: [
    [
      "@babel/preset-env",
      "@babel/preset-typescript",
      {
        corejs: "3",
        useBuiltIns: "entry",
      },
    ],
  ],
};
