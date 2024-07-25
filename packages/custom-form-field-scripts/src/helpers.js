import fs from 'fs'
import paths from './paths.js'
import {
    C3_CONFIG_NOT_FOUND,
    C3_ERROR,
    UNABLE_TO_PARSE_C3_CONFIG,
} from './c3-webpack-plugin/errors.js'

const getModuleMap = async () => {
    const c3Config = await getAppC3Config()
    const { components } = c3Config
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

const getAppC3Config = async () => {
    try {
        const c3Config = await import(paths.c3Config)
        return c3Config.default
    } catch (err) {
        if (err instanceof Error && err.code === 'ERR_MODULE_NOT_FOUND') {
            throw new C3_CONFIG_NOT_FOUND()
        } else if (err instanceof SyntaxError) {
            throw new UNABLE_TO_PARSE_C3_CONFIG()
        }
        throw new C3_ERROR({
            title: 'Unknown error',
            description:
                'Unknown error encountered while reading `c3.config.js`.',
        })
    }
}

const getAppPackageJson = () => {
    const packageJson = JSON.parse(
        fs.readFileSync(paths.appPackageJson, 'utf8')
    )
    return packageJson
}

export { getModuleMap, getAppPackageJson, getAppC3Config }
