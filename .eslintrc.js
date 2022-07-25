module.exports = {
    extends: ['./lint/.eslintrc-base.js'],
    env: {
        node: true,
        browser: true
    },
    globals: {
        consola: true
    },
    ignorePatterns: [
        '**/opensourcecredits/used-packages.json'
    ]
};
