require('../../util/tilde-require');
const config = require('~/config/opensourcecredits.config');
const licensechecker = require('license-checker');
const fs = require('fs');
const path = require('path');
// eslint-disable-next-line no-process-env
const outFile = path.resolve(process.env.CREDITS_BUILD_DIR || __dirname, 'used-packages.json');
const semver = require('semver');
const consola = require('consola');

let currentDir = __dirname;
let localDir, localPkgPath, parentPkgPath, hasParentPkg;
while (!hasParentPkg) {
    currentDir = path.resolve(currentDir, '..');
    parentPkgPath = path.resolve(currentDir, 'package.json');
    if (fs.existsSync(parentPkgPath)) {
        if (!currentDir.includes('webapps-common')) {
            hasParentPkg = true;
            break;
        }
        localDir = currentDir;
        localPkgPath = parentPkgPath;
    }
    if (currentDir === '/') {
        consola.warn('Warning: License collection could not detect parent package!');
        currentDir = localDir;
        parentPkgPath = localPkgPath;
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
            name: pkg.name,
            repository: pkg.repository,
            licenseText: pkg.licenseText
        }));

        // remove duplicate packages (= different versions but same license)
        const allUniquePackages = [];
        allPackages.forEach(pkg => {
            const alreadyExists = allUniquePackages.some(
                firstPkg => firstPkg.name.toLowerCase() === pkg.name.toLowerCase() &&
                    firstPkg.repository.toLowerCase() === pkg.repository.toLowerCase() &&
                    firstPkg.licenseText.toLowerCase() === pkg.licenseText.toLowerCase()
            );

            if (!alreadyExists) {
                allUniquePackages.push(pkg);
            }
        });

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
