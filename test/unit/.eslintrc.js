let inherited = require('../../ui/components/.eslintrc');
module.exports = {
    ...inherited,
    env: {
        ...inherited.env,
        jest: true
    }
};
