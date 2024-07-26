import {
    getAllFilePathsRecursively,
    renderFileWithEjs,
    writeFileWithFolderCreation,
    formatWithPrettier,
} from '../utils.js'
import {
    getFileContentUsingFullPath,
    readFileContentRelativeToCurrentFile,
    getLatestPackageVersion,
} from './utils.js'
import { rename } from '../helpers.js'
import { join } from 'path'

import {
    CUSTOM_FORM_FIELD_MODEL_PACKAGE_NAME,
    CUSTOM_FORM_FIELD_SCRIPTS_PACKAGE_NAME,
} from './constants.js'
import {
    SUPPORTED_REACT_DOM_VERSION,
    SUPPORTED_REACT_VERSION,
} from '@shibi-snowball/custom-form-field-model'
import {
    getC3ProjectTargetKey,
    getC3PlatformKey,
    getC3ComponentKey,
} from '@shibi-snowball/custom-form-field-model/helpers'
import { getC3Config, getProjectTemplatePath } from './helpers.js'

const createProject = async ({
    projectFolderPath,
    projectName,
    projectTarget,
}) => {
    const projectTemplateFiles = getAllFilePathsRecursively(
        getProjectTemplatePath()
    )

    const c3Config = getC3Config(projectTarget)

    const latestFormFieldScriptsVersion = await getLatestPackageVersion(
        CUSTOM_FORM_FIELD_SCRIPTS_PACKAGE_NAME
    )
    const latestFormFieldModelVersion = await getLatestPackageVersion(
        CUSTOM_FORM_FIELD_MODEL_PACKAGE_NAME
    )

    const templateData = {
        CUSTOM_FORM_FIELD_MODEL_PACKAGE_NAME,
        CUSTOM_FORM_FIELD_SCRIPTS_PACKAGE_NAME,
        projectName,
        c3Config,
        projectTarget,
        reactVersion: SUPPORTED_REACT_VERSION,
        reactDomVersion: SUPPORTED_REACT_DOM_VERSION,
        latestFormFieldScriptsVersion,
        latestFormFieldModelVersion,
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
        const targetFilePath = join(
            projectFolderPath,
            relativeDirectoryPath,
            newName
        )
        const formattedContent = await formatWithPrettier(
            renderedFileContent,
            targetFilePath
        )

        writeFileWithFolderCreation(targetFilePath, formattedContent)
    }
}

const addFiles = async ({ projectFolderPath, projectTarget }) => {
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
                projectFolderPath,
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

const formFieldScaffolder = ({
    projectFolderPath,
    projectName,
    projectTarget,
}) => {
    console.log(
        `Scaffolding a c3-app named '${projectName}' which targets Kissflow's '${projectTarget}'...`
    )
    createProject({ projectFolderPath, projectName, projectTarget })
    addFiles({ projectFolderPath, projectTarget })
    // git init and npm install if you can.
}

export { formFieldScaffolder }
