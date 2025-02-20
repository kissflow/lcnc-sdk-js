import { FRAMEWORKS } from './constants.js'
import path from 'path'

const getTemplatePath = (template) => {
    const currentModuleFile = new URL(import.meta.url).pathname
    const currentModuleDirectory = path.dirname(currentModuleFile)
    switch (template) {
        case FRAMEWORKS.REACT:
            return path.resolve(currentModuleDirectory, './template/react/')
        case FRAMEWORKS.VANNILA:
            return path.resolve(currentModuleDirectory, './template/vannila/')
        default:
            throw new Error('Invalid template supplied, ', template)
    }
}

export { getTemplatePath }
