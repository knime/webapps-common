/* eslint-disable no-console, implicit-arrow-linebreak, function-paren-newline */

const fs = require('fs');
const path = require('path');

const camelToSnake = str => {
    let result = '';
    for (let i = 0; i < str.length; i++) { // for all chars in the string
        let thisChar = str[i];

        if (thisChar === thisChar.toUpperCase()) { // if char is uppercase
            const lastChar = str[i - 1];
            if (lastChar && lastChar === lastChar.toLowerCase()) { // if previous char is lowercase
                result += '-';  // add separator
            }
            thisChar = thisChar.toLowerCase(); // change to lowercase
        }

        result += thisChar;
    }
    return result;
};

/* -------------------------------------------------- */

const knimeColors = require('./knimeColors');
const nodeColors = require('./nodeColors');

/* [non-nested map, css variable prefix, output file] */
const files = [
    [knimeColors, '--knime', '../css/variables/knime-colors.css'],
    [nodeColors, '--knime-node', '../css/variables/nodes.css']
];

for (let [map, prefix, output] of files) {
    const outputPath = path.join(__dirname, output);
    console.log('Generating CSS', outputPath);
    fs.writeFileSync(path.join(__dirname, output), `
/* This is an auto-generated file.
 * Do not change manually
*/

:root {
  ${Object.entries(map).map(([key, value]) =>
        `${prefix}-${camelToSnake(key)}: ${value}`
    ).join(';\n  ')};
}
`);
}
