# ![Image](https://www.knime.com/files/knime_logo_github_40x40_4layers.png) KNIME® Webapps-Common

## Shared files for KNIME® web projects with JS, Vue and/or Nuxt

This project contains shared config files, Vue components, CSS files, utilities, etc. that can be used for the frontend
of all KNIME web projects. It also includes an internal NPM package, knime-build-tools, which contains scripts and functionality
commonly used in KNIME web projects.

## Demo

A demo of all contained UI components, icons, CSS colors etc. can be found here:
https://knime.github.io/webapps-common/

or by calling
```sh
npm run demo
```

## Usage
---
You should follow these steps
 
1. include this project as a [git submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
1. add it as an npm dependency:  
    ```json
    {
     "devDependencies": {
       "webapps-common": "file:webapps-common/@knime/demo"
     }
    }
    ```

# Join the Community!
* [KNIME Forum](https://forum.knime.com/)