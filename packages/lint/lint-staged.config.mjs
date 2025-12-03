const eslint =
  "eslint --cache --cache-strategy content --cache-location node_modules/.cache/.eslintcache --fix";

const stylelint =
  "stylelint --cache --cache-strategy content --cache-location node_modules/.cache/.stylelintcache --fix --allow-empty-input";

const prettier = "prettier --cache --write --ignore-unknown";

export default {
  "*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}": [eslint, prettier],
  "*.vue": [eslint, stylelint, prettier],
  "*.css": [stylelint, prettier],
  "*.!({js,jsx,cjs,mjs,ts,tsx,cts,mts,vue,css})": [prettier],
};
