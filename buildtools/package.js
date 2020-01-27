#!/usr/bin/env node

const path = require('path');
const consola = require('consola');
const fs = require('fs');
const versionNumber = require('./versionNumber');
const packageJSON = require('../package.json');
const { execSync } = require('child_process');

let taggedVersion = versionNumber();

let updatedPackage = {
    ...packageJSON,
    version: taggedVersion
};

try {
    fs.writeFileSync(path.join(__dirname, '..', 'package.json'), JSON.stringify(updatedPackage, null, 2));
    fs.writeFileSync(path.join(__dirname, '..', 'version'), taggedVersion);
    execSync('npm run build');
    execSync('npm pack');
} catch (e) {
    consola.error(e);
} finally {
    /* eslint-disable-next-line prefer-template */
    fs.writeFileSync(path.join(__dirname, '..', 'package.json'), JSON.stringify(packageJSON, null, 2) + '\n');
}
