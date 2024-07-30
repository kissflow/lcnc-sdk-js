import chalk from 'chalk'
import { isPlural } from './utils.js'
import { FILE_MAP } from '@shibi-snowball/custom-form-field-model'
import { getFormFieldProjectConfig } from '../helpers.js'

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

const getProjectTargetFromFormFieldProject = async () => {
    const formFieldConfig = await getFormFieldProjectConfig()
    return formFieldConfig.target
}

const getComponentsFromFormFieldProject = async () => {
    const formFieldConfig = await getFormFieldProjectConfig()
    return formFieldConfig.components
}

const getMandatoryModules = () => {
    const mandatoryModules = {}
    for (const [platform, components] of Object.entries(FILE_MAP)) {
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
    getProjectTargetFromFormFieldProject,
    getMandatoryModules,
    logSummary,
    clearScreen,
    getComponentsFromFormFieldProject,
}
