/* eslint-disable no-process-env */
const config = require('../config/opensourcecredits.config');
const licensechecker = require('license-checker');
const fs = require('fs');
const path = require('path');
const outFile = path.resolve(__dirname, 'used-packages.json');
const semver = require('semver');
const pkgUp = require('pkg-up');
// find the package.json file path of the webapps-common parent project
const parentPkgPath = pkgUp.sync({ cwd: '../..' });
const parentRoot = path.resolve(parentPkgPath, '..');

const skip = process.argv.includes('--no-overwrite') && fs.existsSync(outFile);

const excludeScopedPackages = (allPackages, scope) => {
    const formatDependencyList = (packages, orgPrefix) => Object.entries(packages)
        .filter(([name]) => name.startsWith(orgPrefix))
        .map(([name, version]) => `${name}@${semver.coerce(version)}`, []);

    const excludePackagesByScope = (orgPrefix) => [
        ...formatDependencyList(allPackages.dependencies, orgPrefix),
        ...formatDependencyList(allPackages.devDependencies, orgPrefix)
    ];
    
    return excludePackagesByScope('@knime').join(';');
};

if (!skip) {
    // exclude parent package
    const parentPkg = require(parentPkgPath);
    
    // licensechecker only accepts semver versions
    const parentPkgVersion = semver.coerce(parentPkg.version);
    
    config.excludePackages.push(`${parentPkg.name}@${parentPkgVersion}`);

    config.excludePackages.push(
        excludeScopedPackages(parentPkg, '@knime')
    );

    // collect all used production packages and their licenses
    const options = {
        start: parentRoot,
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
            // TODO: WEBP-243 handle licenses with missing text or similar licenses
            name: pkg.name,
            repository: pkg.repository,
            licenseText: pkg.licenseText
        }));

        let allUniquePackages = [];

        allPackages.forEach(pkg => {
            const alreadyExists = allUniquePackages.some(
                firstPkg => firstPkg.name.toLowerCase() === pkg.name.toLowerCase() &&
                    firstPkg.repository.toLowerCase() === pkg.repository.toLowerCase() &&
                    firstPkg.licenseText.replace(/\s+/g, '') === pkg.licenseText.replace(/\s+/g, '')
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
