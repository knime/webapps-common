// custom image rule for SVGs including optimization (inspired by https://github.com/sam3d/nuxt-svg)

const svgoOptions = {
    plugins: [
        { convertShapeToPath: false }
    ]
};

module.exports = {
    test: /\.svg$/i,
    oneOf: [{
        resourceQuery: /\?inline$/,
        use: [
            {
                loader: 'vue-svg-loader',
                options: {
                    svgo: svgoOptions
                }
            }
        ]
    }, {
        resourceQuery: /\?data$/,
        use: [
            {
                loader: 'url-loader'
            },
            {
                loader: 'vue-svg-loader',
                options: svgoOptions
            }
        ]
    }, {
        use: [
            {
                loader: 'file-loader?name=img/[name].[hash:7].[ext]'
            },
            {
                loader: 'svgo-loader',
                options: svgoOptions
            }
        ]
    }]
};
