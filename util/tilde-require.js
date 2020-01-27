/**
 * Allow Vue-style require() calls with `~` as a placeholder for the project root.
 * Note: This works only in files that are run directly in Node, without preprocessing! For example, in tests.
 * @example
 *   require('~/foo/bar/baz');
 */

const assert = require('assert');
const path = require('path');
const Module = require('module');

const projectRoot = path.resolve(__dirname, '..');
assert(require('fs').existsSync(path.resolve(projectRoot, 'package.json')), 'Project root not correct');

Module._resolveFilename = (
    original => (path, ...args) => original.call(Module, path.replace(/^~/, projectRoot), ...args)
)(Module._resolveFilename);

for (let [key, originalExtension] of Object.entries(Module._extensions)) {
    Module._extensions[key] = (module, path) => originalExtension.call(Module, module, path.replace(/^~/, projectRoot));
}
