// from https://github.com/visualfanatic/vue-svg-loader/issues/38#issuecomment-407657015
const vueJest = require('vue-jest/lib/template-compiler');

module.exports = {
    process(content, filename) {
        if (filename.endsWith('/stub.svg')) { // was ?inline import: simulate Vue Component
            const { render } = vueJest({
                content,
                attrs: {
                    functional: false
                }
            });

            return `module.exports = { render: ${render} }`;
        }
        return `module.exports = "stub.svg"`; // simulate file loader
    }
};
