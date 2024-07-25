import ModuleFederationPlugin from 'webpack/lib/container/ModuleFederationPlugin.js'
import { getAppPackageJson } from '../helpers.js'
import { getModuleMap } from '../helpers.js'
import paths from '../paths.js'
import C3WebpackPlugin from '../c3-webpack-plugin/index.js'
import ESLintPlugin from 'eslint-webpack-plugin'

import { createRequire } from 'module'
const require = createRequire(import.meta.url)
import path from 'path'

import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const { dependencies: deps } = getAppPackageJson()
const moduleMap = await getModuleMap()

function getRelativePath(filePath) {
    return path.relative(paths.appPath, filePath)
}

export default {
    context: paths.appRoot,
    mode: 'development',
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
                    require.resolve('css-loader'),
                ],
            },
        ],
    },
    plugins: [
        new C3WebpackPlugin(),
        new ModuleFederationPlugin({
            name: 'Remote4',
            library: {
                type: 'module',
            },
            filename: 'moduleEntry.js',
            exposes: {
                ...moduleMap,
            },
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
