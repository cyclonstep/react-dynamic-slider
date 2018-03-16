const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const port = process.env.PORT || 3000;

module.exports = {
    // Webpack config here
    mode: 'development',
    entry: ['react-hot-loader/patch','./examples/index.js'],
    output: {
        filename: 'bundle.[hash].js',
        publicPath: '/',
        libraryTarget: 'commonjs2'
    },
    devtool: 'inline-source-map',
    externals: {
        react: 'react',
        'react-dom': 'react-dom'
    },
    module: {
        rules: [
            // First Rule
            {
                test: /\.(js)$/,
                include: path.resolve(__dirname, 'src'),
                exclude: /(node_modules|bower_components|build)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
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
    },
    resolve: {
        alias: {
            react: path.resolve('../node_modules/react')
        }
    }
};
