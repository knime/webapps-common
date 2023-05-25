export default {
  "*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}": [
    "eslint --cache --fix",
    "prettier --cache --write",
  ],
  "*.vue": [
    "eslint --cache --fix",
    "stylelint --cache --fix",
    "prettier --cache --write",
  ],
  "*.css": ["stylelint --cache --fix", "prettier --cache --write"],
  "*.!({js,jsx,cjs,mjs,ts,tsx,cts,mts,vue,css})": [
    "prettier --cache --ignore-unknown --write",
  ],
};
