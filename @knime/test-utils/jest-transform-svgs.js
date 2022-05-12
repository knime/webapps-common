// from https://github.com/visualfanatic/vue-svg-loader/issues/38#issuecomment-407657015
const vueJest = require('vue-jest/lib/template-compiler');

module.exports = {
    process(content, filePath) {
        if (filePath.includes('stub.svg')) {
            // imitate the file loader behavior for non-inline svgs
            // see https://vue-svg-loader.js.org/faq.html#how-to-use-both-inline-and-external-svgs
            const filename = filePath.replace(/^.*[\\/]/, '');
            return `module.exports = '${filename}'`;
        }
        const { render } = vueJest({
            content,
            attrs: {
                functional: false
            }
        });

        return `module.exports = { render: ${render} }`;
    }
};
