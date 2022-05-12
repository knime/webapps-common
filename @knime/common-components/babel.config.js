module.exports = {
    env: {
        development: {
            presets: [
                ['env', { modules: false }]
            ]
        },
        test: {
            presets: [
                ['@babel/preset-env', {
                    targets: { node: 'current' }
                }]
            ]
        }
    }
};
