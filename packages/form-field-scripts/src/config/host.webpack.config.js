import ModuleFederationPlugin from 'webpack/lib/container/ModuleFederationPlugin.js'
import { createRequire } from 'module'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import HtmlWebpackPlugin from 'html-webpack-plugin'

import paths from '../paths.js'
import { getAppPackageJson } from '../helpers.js'

const require = createRequire(import.meta.url)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const { dependencies: deps } = getAppPackageJson()

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
        new ModuleFederationPlugin({
            name: 'host',
            shared: {
                react: {
                    requiredVersion: deps.react,
                    import: 'react', // the "react" package will be used a provided and fallback module
                    shareKey: 'react', // under this name the shared module will be placed in the share scope
                    shareScope: 'default', // share scope with this name will be used
                    singleton: true, // only a single version of the shared module is allowed
                },
                'react-dom': {
                    requiredVersion: deps['react-dom'],
                    singleton: true, // only a single version of the shared module is allowed
                },
            },
        }),
    ],
    resolve: {
        extensions: ['.js', '.jsx'],
    },
}
