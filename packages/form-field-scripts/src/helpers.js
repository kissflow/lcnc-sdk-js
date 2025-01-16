import fs from 'fs'
import paths from './paths.js'
import {
    FORM_FIELD_CONFIG_NOT_FOUND,
    FORM_FIELD_ERROR,
    UNABLE_TO_PARSE_FORM_FIELD_CONFIG,
} from './form-field-webpack-plugin/errors.js'

const getModuleMap = () => {
    const components = formFieldProjectConfig
    return Object.entries(components).reduce(
        (moduleMap, [platform, modules]) => {
            Object.entries(modules).forEach(([moduleName, filePath]) => {
                if (filePath.startsWith('./')) {
                    moduleMap['./' + platform + '/' + moduleName] = filePath
                } else {
                    moduleMap['./' + platform + '/' + moduleName] =
                        './' + filePath
                }
            })

            return moduleMap
        },
        {}
    )
}

const getFormFieldProjectConfig = async () => {
    try {
        const formFieldProjectConfig = await import(
            paths.formFieldProjectConfig
        )
        return formFieldProjectConfig.default
    } catch (err) {
        if (err instanceof Error && err.code === 'ERR_MODULE_NOT_FOUND') {
            throw new FORM_FIELD_CONFIG_NOT_FOUND()
        } else if (err instanceof SyntaxError) {
            throw new UNABLE_TO_PARSE_FORM_FIELD_CONFIG()
        }
        throw new FORM_FIELD_ERROR({
            title: 'Unknown error',
            description:
                'Unknown error encountered while reading `form-field.config.js`.',
        })
    }
}

const getAppPackageJson = () => {
    const packageJson = JSON.parse(
        fs.readFileSync(paths.projectPackageJson, 'utf8')
    )
    return packageJson
}

const formFieldProjectConfig = await getFormFieldProjectConfig()

export {
    getModuleMap,
    getAppPackageJson,
    formFieldProjectConfig,
    getFormFieldProjectConfig,
}
