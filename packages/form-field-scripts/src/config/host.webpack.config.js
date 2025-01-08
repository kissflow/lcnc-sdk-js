import { createRequire } from 'module'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

import paths from '../paths.js'

import HtmlWebpackPlugin from 'html-webpack-plugin'

const require = createRequire(import.meta.url)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default {
    devtool: 'eval-source-map',
    context: paths.appRoot,
    entry: path.join(__dirname, '../host/src/index.js'),
    infrastructureLogging: {
        level: 'none',
    },
    output: {
        path: paths.devDist,
    },
    stats: 'none',
    module: {
        rules: [
            {
                test: /\.(js|jsx)?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: require.resolve('babel-loader'),
                        options: {
                            presets: [
                                require.resolve('@babel/preset-env'),
                                require.resolve('@babel/preset-react'),
                            ],
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                use: [
                    require.resolve('style-loader'),
                    {
                        loader: require.resolve('css-loader'),
                        options: {
                            modules: true, // Enables CSS Modules
                            // localIdentName: '[name]__[local]___[hash:base64:5]', // Optional, for custom class names
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '../host/public/index.html'),
            filename: path.join(paths.devDist, 'index.html'),
        }),
    ],
    resolve: {
        extensions: ['.js', '.jsx'],
    },
}
