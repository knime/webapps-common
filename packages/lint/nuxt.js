const globals = require("globals");

const vue = require("./vue.js");

module.exports = [
  ...vue,
  {
    name: "nuxt js additional config",
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },

    rules: {
      "vue/component-name-in-template-casing": [
        "error",
        "PascalCase",
        {
          ignores: ["nuxt", "nuxt-link", "nuxt-child", "client-only"],
        },
      ],

      "vue/order-in-components": [
        "error",
        {
          order: [
            "el",
            "name",
            "parent",
            "functional",
            "validate",
            "layout",
            ["delimiters", "comments"],
            ["components", "directives", "filters"],
            "extends",
            "mixins",
            "middleware",
            "inheritAttrs",
            "loading",
            "scrollToTop",
            "transition",
            "model",
            ["inject", "provide"],
            ["props", "propsData"],
            "data",
            "asyncData",
            "fetch",
            "computed",
            "head",
            "watch",
            "watchQuery",
            "LIFECYCLE_HOOKS",
            "methods",
            ["template", "render"],
            "renderError",
          ],
        },
      ],
    },
  },
];
