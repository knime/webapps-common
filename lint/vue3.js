module.exports = {
  plugins: ["vue", "import"],
  extends: [
    "./base.js",
    "plugin:vue/vue3-recommended",
    "./prettierOverwrites-vue.js",
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    "import/extensions": [
      "error",
      {
        vue: "always",
        json: "always",
        mjs: "always",
        svg: "always",
        config: "ignorePackages",
      },
    ],
    "vue/multi-word-component-names": "off", // TODO enable?
    "vue/no-reserved-component-names": "off", // TODO enable?
    "vue/padding-line-between-blocks": "error",
    "vue/require-v-for-key": "warn",
    "vue/v-slot-style": ["error", "shorthand"],
  },
  settings: {
    "import/resolver": {
      alias: {
        extensions: [".js", ".mjs", ".config.js", ".vue", ".json", ".svg"],
      },
    },
  },
};
