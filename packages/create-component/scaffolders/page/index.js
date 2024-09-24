import { getTemplatePath } from './helpers.js'
import { isBinaryFile, writeFileWithFolderCreation } from '../utils.js'
import {
    getAllFilePathsRecursively,
    formatWithPrettier,
    renderFileWithEjs,
} from '../utils.js'
import { getFileContentUsingFullPath } from '../utils.js'
import { rename } from '../helpers.js'
import { join } from 'path'

async function pageScaffolder({ projectFolderPath, projectName, framework }) {
    const projectTemplateFiles = getAllFilePathsRecursively(
        getTemplatePath(framework)
    )

    const templateData = {
        projectName,
    }

    for (const file of projectTemplateFiles) {
        const { fileName, fileFullPath, relativeDirectoryPath } = file
        const fileContent = getFileContentUsingFullPath(fileFullPath, fileName)

        if (isBinaryFile(fileName)) {
            const newName = rename(fileName)
            const targetFilePath = join(
                projectFolderPath,
                relativeDirectoryPath,
                newName
            )
            writeFileWithFolderCreation(targetFilePath, fileContent)
        } else {
            // Some files are stored with different name, since they have special meaning in the codebase,
            // for example, .gitignore, package.json, etc.
            const newName = rename(fileName)

            const renderedFileContent = renderFileWithEjs(
                fileContent,
                templateData
            )
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
}

export { pageScaffolder }
