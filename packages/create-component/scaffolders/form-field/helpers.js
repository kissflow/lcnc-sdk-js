import { getFileMap } from '@shibi-snowball/custom-form-field-model/helpers'
import path from 'path'

const getC3Config = (projectTarget) => {
    const c3Config = Object.entries(getFileMap(projectTarget)).reduce(
        (c3Config, [platform, components]) => {
            c3Config[platform] = {}
            for (const [
                c3Component,
                { moduleFolderPath, fileExtension },
            ] of Object.entries(components)) {
                c3Config[platform][c3Component] = {
                    moduleFolderPath,
                    fileExtension,
                }
            }
            return c3Config
        },
        {}
    )
    return c3Config
}

const getProjectTemplatePath = () => {
    const currentModuleFile = new URL(import.meta.url).pathname
    const currentModuleDirectory = path.dirname(currentModuleFile)
    return path.resolve(currentModuleDirectory, './project-template/')
}

export { getC3Config, getProjectTemplatePath }
