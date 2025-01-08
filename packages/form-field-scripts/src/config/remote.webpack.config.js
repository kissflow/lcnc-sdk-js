import { createRequire } from 'module'
import ModuleFederationPlugin from 'webpack/lib/container/ModuleFederationPlugin.js'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import ESLintPlugin from 'eslint-webpack-plugin'
import { WebpackManifestPlugin } from 'webpack-manifest-plugin'

import { getAppPackageJson } from '../helpers.js'
import { getModuleMap } from '../helpers.js'
import paths from '../paths.js'
import FormFieldWebpackPlugin from '../form-field-webpack-plugin/index.js'

const require = createRequire(import.meta.url)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const { dependencies: deps } = getAppPackageJson()
const moduleMap = getModuleMap()

function getRelativePath(filePath) {
    return path.relative(paths.appPath, filePath)
}

export default {
    devtool: 'eval-source-map',
    context: paths.appRoot,
    entry: {},
    experiments: {
        outputModule: true,
    },
    infrastructureLogging: {
        level: 'none',
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
        new WebpackManifestPlugin({
            fileName: 'manifest.json',
            generate: () => {
                return { Category: 'FormField' }
            },
        }),
        new FormFieldWebpackPlugin(),
        new ModuleFederationPlugin({
            name: 'Remote4',
            library: {
                type: 'module',
            },
            filename: 'moduleEntry.js',
            exposes: moduleMap,
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

        new ESLintPlugin({
            extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
            formatter: (results) => {
                const errorsOrWarnings = []
                for (const file of results) {
                    const { messages, filePath } = file
                    errorsOrWarnings.push({
                        filePath: getRelativePath(filePath),
                        messages: messages.reduce((messages, message) => {
                            const { line, column, ruleId } = message
                            messages.push({
                                pos: `${line}:${column}`,
                                message: message.message,
                                ruleId,
                            })
                            return messages
                        }, []),
                    })
                }
                return JSON.stringify(errorsOrWarnings)
            },
            eslintPath: require.resolve('eslint'),
            failOnError: true,
            context: paths.appSrc,
            cache: true,
            cacheLocation: path.resolve(
                paths.appNodeModules,
                '.cache/.eslintcache'
            ),
            cwd: paths.appPath,
            resolvePluginsRelativeTo: __dirname,
        }),
    ],
    resolve: {
        // alias: {
        //   react: require.resolve("react"),
        // },
        extensions: ['.js', '.jsx'],
    },
}
