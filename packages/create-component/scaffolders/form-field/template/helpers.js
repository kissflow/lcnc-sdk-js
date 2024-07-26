import latestVersion from 'latest-version'

import { renames } from './constants.js'
import { getFileMap } from '@shibi-snowball/c3-model/helpers'
import chalk from 'chalk'

const rename = (fileName) => {
    // Make sure all the files present in the `project-template` are unique...

    if (fileName in renames) {
        return renames[fileName]
    }
    return fileName
}

const getLatestPackageVersion = async (packageName) => {
    try {
        const verison = await latestVersion(packageName)
        return verison
    } catch (error) {
        console.log(
            chalk.red(`Error retrieving the latest version: ${error.message}.`)
        )
        process.exit(0)
    }
}

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

const getProps = () => {

}

export { getLatestPackageVersion, rename, getC3Config, getProps }
