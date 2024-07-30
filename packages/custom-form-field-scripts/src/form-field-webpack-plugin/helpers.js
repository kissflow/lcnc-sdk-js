import chalk from 'chalk'
import { isPlural } from './utils.js'
import { getFileMap } from '@shibi-snowball/custom-form-field-model/helpers'
import { getAppC3Config } from '../helpers.js'

const clearScreen = () => {
    process.stdout.write('\x1B[2J\x1B[3J\x1B[H') // Clears screen, scrollback buffer, and moves cursor to the top-left corner
}

const logSummary = ({ numberOfErrors, numberOfWarnings }) => {
    if (numberOfErrors > 0 && numberOfWarnings > 0) {
        console.log(
            `Compiled with ${chalk.bold.red(`${numberOfErrors} error${isPlural(numberOfErrors)}`)} and ${chalk.bold.yellow(`${numberOfWarnings} warning${isPlural(numberOfWarnings)}`)}`
        )
    } else if (numberOfErrors > 0) {
        console.log(
            `Compiled with ${chalk.bold.red(`${numberOfErrors} error${isPlural(numberOfErrors)}`)}`
        )
    } else if (numberOfWarnings > 0) {
        console.log(
            `Compiled with ${chalk.bold.yellow(`${numberOfWarnings} warning${isPlural(numberOfWarnings)}`)}`
        )
    }
}

const getModuleMap = async () => {
    const c3Config = await getAppC3Config()
    const { components } = c3Config
    const moduleMap = Object.entries(components).reduce(
        (moduleMap, [module, filePath]) => {
            if (filePath.startsWith('./')) {
                moduleMap['./' + module] = filePath
            } else {
                moduleMap['./' + module] = './' + filePath
            }
            return moduleMap
        },
        {}
    )
    return moduleMap
}

const getProjectTargetFromC3App = async () => {
    const c3Config = await getAppC3Config()
    return c3Config.target
}

const getComponentsFromC3App = async () => {
    const c3Config = await getAppC3Config()
    return c3Config.components
}

const getMandatoryModules = (projectTarget) => {
    const fileMap = getFileMap(projectTarget)
    const mandatoryModules = {}
    for (const [platform, components] of Object.entries(fileMap)) {
        mandatoryModules[platform] = []
        for (const [component, { isMandatory }] of Object.entries(components)) {
            if (isMandatory) {
                mandatoryModules[platform].push(component)
            }
        }
    }
    return mandatoryModules
}

export {
    getModuleMap,
    getProjectTargetFromC3App,
    getAppC3Config,
    getMandatoryModules,
    logSummary,
    clearScreen,
    getComponentsFromC3App,
}
