import {
    getAllFilePathsRecursively,
    getFileContentUsingFullPath,
    renderFileWithEjs,
    writeFileWithFolderCreation,
    formatWithPrettier,
    readFileContentRelativeToCurrentFile,
} from './utils.js'
import { rename, getLatestPackageVersion } from './helpers.js'
import { join } from 'path'

import { C3_SCRIPTS, C3_MODEL } from './constants.js'
import {
    SUPPORTED_REACT_DOM_VERSION,
    SUPPORTED_REACT_VERSION,
} from '@shibi-snowball/c3-model'
import {
    getC3ProjectTargetKey,
    getC3PlatformKey,
    getC3ComponentKey,
} from '@shibi-snowball/c3-model/helpers'
import { getC3Config } from './helpers.js'

const createProject = async (projectPath, projectName, projectTarget) => {
    const projectTemplateFiles =
        getAllFilePathsRecursively('./project-template')

    const c3Config = getC3Config(projectTarget)

    const latestC3ScriptsVersion = await getLatestPackageVersion(C3_SCRIPTS)
    const latestC3ModelVersion = await getLatestPackageVersion(C3_MODEL)

    const templateData = {
        C3_MODEL,
        projectName,
        c3Config,
        projectTarget,
        reactVersion: SUPPORTED_REACT_VERSION,
        reactDomVersion: SUPPORTED_REACT_DOM_VERSION,
        latestC3ScriptsVersion,
        latestC3ModelVersion,
        getC3ProjectTargetKey,
        getC3PlatformKey,
        getC3ComponentKey,
    }

    // Copy the base template into the target folder...
    for (const file of projectTemplateFiles) {
        const { fileName, fileFullPath, relativeDirectoryPath } = file
        const fileContent = getFileContentUsingFullPath(fileFullPath)

        // Some files are stored with different name, since they have special meaning in the codebase,
        // for example, .gitignore, package.json, etc.
        const newName = rename(fileName)

        const renderedFileContent = renderFileWithEjs(fileContent, templateData)
        const targetFilePath = join(projectPath, relativeDirectoryPath, newName)
        const formattedContent = await formatWithPrettier(
            renderedFileContent,
            targetFilePath
        )

        writeFileWithFolderCreation(targetFilePath, formattedContent)
    }
}

const addFiles = async (projectPath, projectTarget) => {
    const component = readFileContentRelativeToCurrentFile(
        './file-templates/ReactComponent.ejs'
    )

    for (const [platform, files] of Object.entries(
        getC3Config(projectTarget)
    )) {
        for (const [
            componentName,
            { moduleFolderPath, fileExtension },
        ] of Object.entries(files)) {
            const templateData = {
                componentName,
                props: '',
            }
            const renderedFileContent = renderFileWithEjs(
                component,
                templateData
            )

            const targetFilePath = join(
                projectPath,
                `${moduleFolderPath}/${componentName}.${fileExtension}`
            )

            const formattedContent = await formatWithPrettier(
                renderedFileContent,
                targetFilePath
            )
            writeFileWithFolderCreation(targetFilePath, formattedContent)
        }
    }
}

const scaffoldProject = (projectPath, projectName, projectTarget) => {
    createProject(projectPath, projectName, projectTarget)
    addFiles(projectPath, projectTarget)
    // git init and npm install if you can.
}

export { scaffoldProject }
