# Shared files for web projects

## Usage

You can either copy files directly into your project (not recommended), or include this project as a [git submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules).


### ESLint

Include this in your [ESLint config file]:

```js
{
  extends: ['./webapps-common/lint/.eslintrc-base.js']
}
```

Use `.eslintrc-nuxt.js` for nuxt.js projects, `eslintrc-vue.js` for Vue.js projects, `.eslintrc-legacy.js`
for legacy views (KNIME AP, ES3), and`.eslintrc-base.js` for other projects.

Configuration files are made for ESLint 5.

### CSSLint

Import the config file using

```
module.exports = require('./webapps-common/lint/.stylelintrc');
```

in your `.stylelintrc.js`.
