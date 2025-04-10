import paths from './paths.js'
import {
    FORM_FIELD_CONFIG_NOT_FOUND,
    FORM_FIELD_ERROR,
    UNABLE_TO_PARSE_FORM_FIELD_CONFIG,
} from './form-field-webpack-plugin/errors.js'
import { pathToFileURL } from 'url'
import fs from 'fs'
import path from 'path'
import archiver from 'archiver'

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
    const fileUrl = pathToFileURL(paths.formFieldProjectConfig)
    try {
        const formFieldProjectConfig = await import(fileUrl)
        return formFieldProjectConfig.default
    } catch (err) {
        if (err instanceof Error && err.code === 'ERR_MODULE_NOT_FOUND') {
            throw new FORM_FIELD_CONFIG_NOT_FOUND()
        } else if (err instanceof SyntaxError) {
            throw new UNABLE_TO_PARSE_FORM_FIELD_CONFIG()
        }
        throw new FORM_FIELD_ERROR({
            title: 'Unknown error',
            description: err,
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

export async function zipDirectoryContent(sourceDirectory, zipFilePath) {
    const output = fs.createWriteStream(zipFilePath)
    const archive = archiver('zip', {
        zlib: { level: 9 },
    })

    return new Promise((resolve, reject) => {
        output.on('close', () => {
            resolve()
        })

        archive.on('error', (err) => reject(err))

        archive.pipe(output)

        fs.readdirSync(sourceDirectory).forEach((fileOrDir) => {
            const fullPath = path.join(sourceDirectory, fileOrDir)
            const stats = fs.statSync(fullPath)

            if (stats.isFile()) {
                archive.file(fullPath, { name: fileOrDir })
            } else if (stats.isDirectory()) {
                archive.directory(fullPath, fileOrDir)
            }
        })

        archive.finalize()
    })
}

export function removeDirectory(path) {
    try {
        fs.rmSync(path, { recursive: true, force: true })
    } catch (err) {
        console.error(`Unable to delete ${path}, `, err)
    }
}
