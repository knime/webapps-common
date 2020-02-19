/* eslint-disable no-process-env */
const config = require('../config/opensourcecredits.config');
const licensechecker = require('license-checker');
const fs = require('fs');
const path = require('path');
const outFile = path.resolve(__dirname, 'used-packages.json');
const semver = require('semver');
const consola = require('consola');

let currentDir = __dirname;
let parentPkgPath, hasParentPkg;

while (!hasParentPkg) {
    currentDir = path.resolve(currentDir, '..');
    parentPkgPath = path.resolve(currentDir, 'package.json');
    if (fs.existsSync(parentPkgPath)) {
        if (!currentDir.includes('webapps-common')) {
            hasParentPkg = true;
            break;
        }
    }
    if (currentDir === '/') {
        consola.warn('Warning: License collection could not detect parent package!');
        break;
    }
}

const skip = process.argv.includes('--no-overwrite') && fs.existsSync(outFile);

if (!skip) {

    // exclude parent package
    const parentPkg = require(parentPkgPath);
    const parentPkgVersion = semver.coerce(parentPkg.version); // licensechecker only accepts semver versions
    config.excludePackages.push(`${parentPkg.name}@${parentPkgVersion}`);

    // collect all used production packages and their licenses
    const options = {
        start: currentDir,
        production: true,
        onlyAllow: config.onlyAllow.join(';'),
        excludePackages: config.excludePackages.join(';'),
        customPath: path.resolve(__dirname, 'collect-packages-format.json')
    };
    licensechecker.init(options, (err, collectedPackages) => {
        if (err) {
            throw err;
        }
        // convert collected packages to array and merge with manually added packages
        let allPackages = Object.values(collectedPackages).concat(config.manualPackages);

        // keep only the needed props
        allPackages = allPackages.map(pkg => ({
            // TODO: WEBP-243 handle licenses with missing text
            name: pkg.name,
            repository: pkg.repository,
            licenseText: pkg.licenseText
        }));

        // remove duplicate packages (could be different versions but same license, etc.)
        const allUniquePackages = allPackages.filter((pkg, pos, arr) =>  arr.indexOf(pkg) === pos);

        // sort packages by name
        allUniquePackages.sort((a, b) => a.name.localeCompare(b.name));
        // write file to be imported by the app to show open source credits
        fs.writeFile(outFile, JSON.stringify(allUniquePackages), (err) => {
            if (err) {
                throw err;
            }
        });
    });
}
