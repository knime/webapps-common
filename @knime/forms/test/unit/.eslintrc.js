let inherited = require('../../.eslintrc');
module.exports = {
    ...inherited,
    env: {
        ...inherited.env,
        jest: true
    }
};