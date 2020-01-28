#!/usr/bin/env node

const path = require('path');
const consola = require('consola');
const fs = require('fs');
const versionNumber = require('./versionNumber');
const packageJSON = require('../package.json');
const { execSync } = require('child_process');
const parentPath = process.argv.pop();

let taggedVersion = versionNumber(path.resolve(parentPath, 'package.json'));

let updatedPackage = {
    ...packageJSON,
    version: taggedVersion
};

try {
    fs.writeFileSync(path.join(parentPath, '..', 'package.json'), JSON.stringify(updatedPackage, null, 2));
    fs.writeFileSync(path.join(parentPath, '..', 'version'), taggedVersion);
    execSync('npm run build', { cwd: parentPath });
    execSync('npm pack', { cwd: parentPath });
} catch (e) {
    consola.error(e);
} finally {
    /* eslint-disable-next-line prefer-template */
    fs.writeFileSync(path.join(parentPath, '..', 'package.json'), JSON.stringify(packageJSON, null, 2) + '\n');
}
