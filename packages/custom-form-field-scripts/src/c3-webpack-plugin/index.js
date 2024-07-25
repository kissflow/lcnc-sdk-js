import path from 'path'
import { clearScreen } from './helpers.js'
import { logSummary } from './helpers.js'
import { performOnetimeChecks, performRuntimeChecks } from './verifications.js'
import webpack from 'webpack'
import chalk from 'chalk'

import { logBoxenError, logBoxenWarning } from '../logBoxen.js'
import {
    DEFAULT_EXPORT_NOT_FOUND_ERROR,
    DEFAULT_EXPORT_NOT_REACT_COMPONENT_ERROR,
} from './errors.js'

const banner = () => {
    console.log('**********************************************')
    console.log('This is a banner!')
    console.log('**********************************************')
}

const isDevMode = process.env.WEBPACK_SERVE === 'true'

class C3WebpackPlugin {
    hasC3errors = false
    apply(compiler) {
        const getRunHook = () => {
            return isDevMode
                ? compiler.hooks.watchRun
                : compiler.hooks.beforeRun
        }

        const runHook = getRunHook()
        runHook.tap(C3WebpackPlugin.name, async (compiler, callback) => {
            compiler.hooks.thisCompilation.tap(
                C3WebpackPlugin.name,
                async (compilation) => {
                    try {
                        if (!this.firstRun) {
                            this.firstRun = true
                            try {
                                await performOnetimeChecks()
                            } catch (err) {
                                const { title, description } = err
                                logBoxenError({ title, description })
                                process.exit(0)
                            }
                            await performRuntimeChecks()
                        } else {
                            await performRuntimeChecks()
                        }
                    } catch (err) {
                        // Check,
                        // DEFAULT_EXPORT_NOT_FOUND_ERROR.
                        // DEFAULT_EXPORT_NOT_REACT_COMPONENT_ERROR
                        if (
                            err instanceof DEFAULT_EXPORT_NOT_FOUND_ERROR ||
                            err instanceof
                                DEFAULT_EXPORT_NOT_REACT_COMPONENT_ERROR
                        ) {
                            compilation.errors = []
                            const error = new webpack.WebpackError(
                                err.description
                            )
                            error.modulePath = err.modulePath
                            compilation.errors.push(error)
                        }
                    }
                }
            )
        })

        compiler.hooks.done.tap(C3WebpackPlugin.name, (stats) => {
            if (isDevMode) {
                clearScreen()
            }
            if (stats.hasErrors() || stats.hasWarnings()) {
                let numberOfErrors = stats.compilation.errors.length
                let numberOfWarnings = stats.compilation.warnings.length

                const getModulePath = (error) => {
                    if (error?.module && error?.module?.resource) {
                        path.relative(
                            compiler?.context,
                            error?.module?.resource
                        )
                    } else if (error.modulePath) {
                        return error.modulePath
                    } else {
                        return 'Unknown file'
                    }
                }

                if (stats.hasWarnings()) {
                    stats.compilation.warnings.forEach((warning, index) => {
                        // The author of eslint webpack plugin is aggregating all the
                        // errors/warning associated with eslint and pushing it as a single
                        // item (compilation.errors.push(errors)), instead of pushing them one
                        // by one (compilation.errors.push(...errors)).
                        const { name } = warning
                        if (name === 'ESLintError') {
                            const warnings = JSON.parse(
                                warning.message.slice('[eslint]'.length)
                            )

                            numberOfWarnings--
                            for (const warning of warnings) {
                                const { messages, filePath } = warning
                                logBoxenWarning({
                                    title: filePath,
                                    description: messages.reduce(
                                        (messages, message) => {
                                            const { pos, ruleId } = message
                                            numberOfWarnings++ // breaking the rules of func programming, but this works.
                                            messages += `${chalk.bold('Line ' + pos)}: ${message.message} - ${chalk.yellow(ruleId)}\n`
                                            return messages
                                        },
                                        ''
                                    ),
                                })
                            }
                        }
                    })
                }

                if (stats.hasErrors()) {
                    const errors = stats.compilation.errors
                    errors.forEach((error) => {
                        const { name } = error
                        if (name === 'ESLintError') {
                            // I hate this plugin!!!!!!!!!!!!
                            const errors = JSON.parse(
                                error.message.slice('[eslint]'.length)
                            )

                            numberOfErrors--
                            for (const error of errors) {
                                const { messages, filePath } = error
                                logBoxenError({
                                    title: filePath,
                                    description: messages.reduce(
                                        (messages, message) => {
                                            const { pos, ruleId } = message
                                            numberOfErrors++ // this is not good (not functional programming), but still...
                                            messages += `${chalk.bold('Line ' + pos)}: ${message.message} - ${chalk.red(ruleId)}\n`
                                            return messages
                                        },
                                        ''
                                    ),
                                })
                            }
                        } else {
                            const file = getModulePath(error)
                            const errorMsg = error.message ?? error
                            logBoxenError({
                                title: file,
                                description: errorMsg,
                            })
                        }
                    })
                }

                logSummary({ numberOfWarnings, numberOfErrors })
            } else {
                banner()
            }
        })

        compiler.hooks.failed.tap(C3WebpackPlugin.name, (error) => {
            console.error('Build failed with error:', error)
        })
    }
}

export default C3WebpackPlugin
