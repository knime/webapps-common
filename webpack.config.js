const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './src/dev.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true
        })
    ],
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            src: path.resolve(__dirname, 'src'),
            test: path.resolve(__dirname, 'test')
        }
    },
    devServer: {
        static: `${__dirname}/public`,
        compress: true,
        port: 9000
    },
    watch: false,
    devtool: 'source-map'
};
