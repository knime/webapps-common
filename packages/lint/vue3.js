import vuePlugin from "eslint-plugin-vue";

import baseConfig from "./base.js";
import prettierOverridesVue from "./prettierOverwrites-vue.js";

export default [
  // extend baseConfig files to include vue files
  ...baseConfig.map((config) => {
    if (config.name?.includes("@knime/eslint-config/base")) {
      return {
        ...config,
        files: [...config.files, "**/*.vue"],
      };
    }
    return config;
  }),
  ...vuePlugin.configs["flat/recommended"], // plugin:vue/vue3-recommended
  ...prettierOverridesVue,
  {
    name: "@knime/eslint-config/vue3",
    files: ["**/*.vue"],
    plugins: {
      vue: vuePlugin,
    },

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    settings: {
      "import-x/resolver": {
        "eslint-import-resolver-custom-alias": {
          extensions: [".js", ".mjs", ".config.js", ".vue", ".json", ".svg"],
        },
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
      "vue/multi-word-component-names": "off",
      "vue/no-reserved-component-names": "off",
      "vue/padding-line-between-blocks": "error",
      "vue/require-v-for-key": "warn",
      "vue/v-slot-style": ["error", "shorthand"],
    },
  },
];
