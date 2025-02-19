const vueTsConfig = require("@vue/eslint-config-typescript");
const importPlugin = require("eslint-plugin-import");

const prettierOverridesVue = require("./prettierOverwrites-vue.js");
const vue3Config = require("./vue3.js");

// const configsNoHelper = [
//   ...vue3Config,
//   vueTsConfig.vueTsConfigs.recommended,
//   ...prettierOverridesVue,
//   {
//     rules: {
//       "no-duplicate-imports": "off",
//       "import/no-duplicates": "error",
//     },
//   },
// ];

// const configsHelper = vueTsConfig.defineConfigWithVueTs({
//   extends: [
//     vue3Config,
//     vueTsConfig.vueTsConfigs.recommended,
//     prettierOverridesVue,
//   ],
//   plugins: {
//     import: importPlugin,
//   },
//   rules: {
//     "no-duplicate-imports": "off",
//     "import/no-duplicates": "error",
//   },
// });

// console.log(configsHelper);

module.exports = vueTsConfig.defineConfigWithVueTs({
  extends: [
    vue3Config,
    vueTsConfig.vueTsConfigs.recommended,
    prettierOverridesVue,
  ],
  plugins: {
    import: importPlugin,
  },
  rules: {
    "no-duplicate-imports": "off",
    "import/no-duplicates": "error",
  },
});
