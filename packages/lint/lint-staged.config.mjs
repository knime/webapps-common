const eslint = "eslint --fix";

const stylelint = "stylelint --fix --allow-empty-input";

const prettier = "prettier --write --ignore-unknown";

export default {
  "*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}": [eslint, prettier],
  "*.vue": [eslint, stylelint, prettier],
  "*.css": [stylelint, prettier],
  "*.!({js,jsx,cjs,mjs,ts,tsx,cts,mts,vue,css})": [prettier],
};
