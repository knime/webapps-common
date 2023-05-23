export default {
  "*.{vue,js,jsx,cjs,mjs,ts,tsx,cts,mts}": ["eslint --cache --fix"],
  "*.{css,vue}": ["stylelint --cache --fix"],
  "*": ["prettier --cache --ignore-unknown --write"],
};
