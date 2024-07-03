export default {
  "*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}": [
    "eslint --cache --fix",
    "prettier --cache --write",
  ],
  "*.vue": [
    "eslint --cache --fix",
    "stylelint --fix --allow-empty-input",
    "prettier --cache --write",
  ],
  "*.css": ["stylelint --fix --allow-empty-input", "prettier --cache --write"],
  "*.!({js,jsx,cjs,mjs,ts,tsx,cts,mts,vue,css})": [
    "prettier --cache --ignore-unknown --write",
  ],
};
