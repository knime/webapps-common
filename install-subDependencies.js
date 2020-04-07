/* eslint-disable no-process-env, no-console */
const { execSync } = require('child_process');
const path = require('path');

let npmCommand = process.env.npm_config_refer === 'ci' ? 'ci' : 'install';
console.info(`Running "npm ${npmCommand}" in ${__dirname}/buildtools`);
execSync(`npm ${npmCommand}`, {
    cwd: path.join(`${__dirname}`, 'buildtools')
});
