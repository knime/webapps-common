# ![Image](https://www.knime.com/files/knime_logo_github_40x40_4layers.png) KNIME® Shared Icons

## Shared files for KNIME® web projects with JS, Vue and/or Nuxt

This project contains shared config files, Vue components, CSS files, utilities, etc. that can be used for the frontend
of all KNIME web projects. It also includes an internal NPM package, knime-build-tools, which contains scripts and functionality
commonly used in KNIME web projects.

## Demo

A demo of all contained UI components, icons, CSS colors etc. can be found here:
https://knime.github.io/webapps-common/

## Usage
---
You should follow these steps
 
1. include this project as a [git submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
1. add it as an npm dependency:  
    ```json
    {
     "devDependencies": {
       "webapps-common": "file:webapps-common/@knime/icons"
     }
    }
    ```

A helper module for build specific utilities. For more details, see `/buildtools/README.md`.
# SVG-Style-Guidelines
To maintain a consistent structure of the files, SVGs uploaded to this repository should meet the following requirements:

- Icons are made out of lines and not faces
- Stroke width is set via css to maintain crisp text when zooming in and out
- Multiple d values are concatenated into one
- Before new SVGs are included, they should be cleaned up. This means, that:
    - Unnecessary Tags are removed
    - XML Headers are removed
    - View Box is set to 0 0 32 32
    - There is a stroke color set
- Text elements have the following attributes set: `class="text" fill="black" stroke="none" stroke-linejoin="miter"`
- Stroke-miterlimit is not needed in most cases, check if it is needed for your SVG
- Special case for dots in the SVG. These are made of a line width length 0 and the following attributes:
`stroke-linecap="round" x1="0" y1="0" x2="0" y2="0"   transform="translate(x, y) scale(1.6)"`
- The svg header should look like this:
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" stroke="#000" fill="none" stroke-linejoin="round">`

# Join the Community!
* [KNIME Forum](https://forum.knime.com/)

[peer dependencies]: https://docs.npmjs.com/files/package.json#peerdependencies

