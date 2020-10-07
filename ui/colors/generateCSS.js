/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const camelToSnake = str => str.replace(/(.?)([A-Z])/g,
    (_, before, letter) => `${before}${before ? '-' : ''}${letter.toLowerCase()}`);


/* ['filename', css variable prefix, output file] */
const assets = [
    ['knimeColors', '--knime', '../css/variables/knime-colors.css'],
    ['nodeColors', '--knime-node', '../css/variables/nodes.css']
];

for (let [filename, prefix, output] of assets) {
    const inputPath = require.resolve(path.join(__dirname, filename));
    const map = require(inputPath);
    const outputPath = path.join(__dirname, output);
    console.log('Generating CSS', outputPath);
    const contents = `/* This is an auto-generated file.
 * Do not change manually.
 * Changes should go to ${inputPath.replace(/.*webapps-common\//, '')}.
*/

:root {
  ${Object.entries(map).map(([key, value]) => `${prefix}-${camelToSnake(key)}: ${value}`).join(';\n  ')};
}
`;
    fs.writeFileSync(path.join(__dirname, output), contents);
}
