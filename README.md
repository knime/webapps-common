# Shared files for web projects with JS, Vue and/or Nuxt

## Usage

You can either
* copy files directly into your project (not recommended), *or*
* include this project as a [git submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules), _optionally_ including
 it as an npm dependency:
   ```json
   {
     "devDependencies": {
       "webapps-common": "file:webapps-common"
     }
   }
   ```
   The latter allows to require the files via `require('webapps-common')` as if they had been pulled from the npm
   registry, as opposed to writing `require('{RELATIVE_PATH}/webapps-common')`.  
   It also makes sure that [peer dependencies] are installed correctly.

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

### stylelint

Import the config file using

```
module.exports = require('webapps-common/lint/.stylelintrc');
```

in your `.stylelintrc.js`.

Configuration files are made for Stylelint 10.

### webpack

(see inline comments in `webpack/*`)

[ESLint config file]: https://eslint.org/docs/user-guide/configuring
[peer dependencies]: https://docs.npmjs.com/files/package.json#peerdependencies
