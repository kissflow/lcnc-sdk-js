import path, { join } from 'path'
import { fileURLToPath } from 'url'

import { rename } from '../helpers.js'
import {
    getAllFilePathsRecursively,
    formatWithPrettier,
    renderFileWithEjs,
    getFileContentUsingFullPath,
    isBinaryFile,
    writeFileWithFolderCreation,
} from '../utils.js'

const templateDir = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    './template'
)

async function appScaffolder({ projectFolderPath, projectName, appId }) {
    const projectTemplateFiles = getAllFilePathsRecursively(templateDir)

    const templateData = {
        projectName,
        appId,
    }

    for (const file of projectTemplateFiles) {
        const { fileName, fileFullPath, relativeDirectoryPath } = file
        const fileContent = getFileContentUsingFullPath(fileFullPath, fileName)
        const newName = rename(fileName)
        const targetFilePath = join(
            projectFolderPath,
            relativeDirectoryPath,
            newName
        )

        if (isBinaryFile(fileName)) {
            writeFileWithFolderCreation(targetFilePath, fileContent)
        } else {
            const renderedFileContent = renderFileWithEjs(
                fileContent,
                templateData
            )
            const formattedContent = await formatWithPrettier(
                renderedFileContent,
                targetFilePath
            )
            writeFileWithFolderCreation(targetFilePath, formattedContent)
        }
    }
}

export { appScaffolder }
