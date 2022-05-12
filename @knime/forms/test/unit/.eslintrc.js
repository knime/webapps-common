let inherited = require('../../.eslintrc.js');
module.exports = {
    ...inherited,
    env: {
        ...inherited.env,
        jest: true
    }
};
