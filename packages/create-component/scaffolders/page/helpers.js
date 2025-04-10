import { FRAMEWORKS } from './constants.js'
import path from 'path'
import { fileURLToPath } from 'url'

const getTemplatePath = (template) => {
    const currentModuleFile =  fileURLToPath(import.meta.url)
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
