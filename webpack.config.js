const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const port = process.env.PORT || 3000;

module.exports = {
    // Webpack config here
    mode: 'development',
    entry: ['react-hot-loader/patch','./src/index.js'],
    output: {
        filename: 'bundle.[hash].js',
        publicPath: '/'
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            // First Rule
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            // Second Rule
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            camelCase: true,
                            sourceMap: true
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: 'examples/example.html'
        })
    ],
    devServer: {
        host: 'localhost',
        port: port,
        historyApiFallback: true,
        open: true,
        hot:true
    }
};
