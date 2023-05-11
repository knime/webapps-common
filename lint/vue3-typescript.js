module.exports = {
  extends: [
    "./vue3.js",
    "@vue/eslint-config-typescript",
    "./prettierOverwrites-vue.js",
  ],
  rules: {
    "no-duplicate-imports": "off",
    "import/no-duplicates": "error",
  },
};
