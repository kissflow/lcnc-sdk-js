import { FILE_MAP } from '@kissflow/form-field-config'
import path from 'path'
import { fileURLToPath } from 'url'

const getFormFieldConfig = () => {
    const formFieldConfig = Object.entries(FILE_MAP).reduce(
        (formFieldConfig, [platform, components]) => {
            formFieldConfig[platform] = {}
            for (const [
                formFieldComponent,
                { moduleFolderPath, fileExtension },
            ] of Object.entries(components)) {
                formFieldConfig[platform][formFieldComponent] = {
                    moduleFolderPath,
                    fileExtension,
                }
            }
            return formFieldConfig
        },
        {}
    )
    return formFieldConfig
}

const getProjectTemplatePath = () => {
    const currentModuleFile = fileURLToPath(import.meta.url)
    const currentModuleDirectory = path.dirname(currentModuleFile)
    return path.resolve(currentModuleDirectory, './project-template/')
}

export { getFormFieldConfig, getProjectTemplatePath }
