#!/usr/bin/env node

const semver = require('semver');
const packageJSON = require('../package.json');
const { execSync } = require('child_process');

let date = new Date().toISOString().replace(/[^0-9a-z]/gi, '-');

let versionNumber = () => {

    let { version } = packageJSON;

    if (!semver.valid(version)) {
        throw new Error(`Invalid version ${version}`);
    }

    if (semver.coerce(version).version !== version) {
        return version;
    }

    let revision = execSync('git rev-parse --short HEAD').toString().trim();

    return `${version}+git-${revision}.${date.replace(/-[0-9]{3}Z$/, 'Z')}`;

};

if (require.main === module) {
    // eslint-disable-next-line no-console
    console.log(versionNumber());
} else {
    module.exports = versionNumber;
}
