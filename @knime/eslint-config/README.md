# ![Image](https://www.knime.com/files/knime_logo_github_40x40_4layers.png) KNIME® Shared Config

## Shared config files for KNIME® web projects with JS, Vue and/or Nuxt

This project contains shared config files, that can be used for the frontend of all KNIME web projects.


## Usage
---
You should follow these steps
 
1. include this project as a [git submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
1. add it as an npm dependency:  
    ```json
    {
     "devDependencies": {
       "config": "file:webapps-common/@knime/config"
     }
    }
    ```

## ESLint
---
Include this in your [ESLint config file]:

```js
{
  extends: ['./webapps-common/@knime/config/lint/.eslintrc-base.js']
}
```

Use `.eslintrc-nuxt.js` for nuxt.js projects, `eslintrc-vue.js` for Vue.js projects, `.eslintrc-legacy.js`
for legacy views (KNIME AP, ES3), and`.eslintrc-base.js` for other projects.


## **stylelint**
---
Import the config file using

```
module.exports = require('webapps-common/@knime/config/lint/.stylelintrc');
```

in your `.stylelintrc.js`.

Configuration files are made for Stylelint 10.


## **webpack**
---
(see inline comments in `webpack/*`)