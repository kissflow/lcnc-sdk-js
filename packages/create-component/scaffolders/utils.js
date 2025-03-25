import ejs from 'ejs'
import fs from 'fs'
import path from 'path'
import * as prettier from 'prettier'
import { BINARY_FILE_EXTENSIONS, prettierConfig } from './constants.js'

function getAllFilePathsRecursively(directoryPath) {
    const filesList = []

    function readFilesHelper(currentPath, parentDirectory = '') {
        const files = fs.readdirSync(currentPath)

        files.forEach((file) => {
            const filePath = path.join(currentPath, file)
            const stats = fs.statSync(filePath)

            if (stats.isDirectory()) {
                // If it's a directory, recursively read its files
                readFilesHelper(filePath, path.join(parentDirectory, file))
            } else {
                // If it's a file, add an object with fileName, filePath, and relativePath to the list
                filesList.push({
                    fileName: file,
                    fileFullPath: filePath,
                    relativeDirectoryPath: parentDirectory,
                })
            }
        })
    }

    readFilesHelper(directoryPath)
    return filesList
}

const renderFileWithEjs = (fileContent, data) => {
    return ejs.render(fileContent, data)
}

const formatWithPrettier = async (content, filePath) => {
    try {
        const formattedContent = await prettier.format(content, {
            filepath: filePath,
            ...prettierConfig,
        })
        return formattedContent
    } catch (err) {
        return content
    }
}

const makeDirectory = (projectPath) => {
    fs.mkdirSync(projectPath)
}

function writeFileWithFolderCreation(targetFilePath, renderedFileContent) {
    const targetDirectory = path.dirname(targetFilePath)

    // Create the directory if it doesn't exist
    if (!fs.existsSync(targetDirectory)) {
        fs.mkdirSync(targetDirectory, { recursive: true })
    }

    if (isBinaryFile(targetFilePath)) {
        const binaryData = Buffer.from(renderedFileContent, 'binary') // convert string to binary
        fs.writeFileSync(targetFilePath, binaryData)
    } else {
        // Write the file content to the target file
        fs.writeFileSync(targetFilePath, renderedFileContent, 'utf-8')
    }
}

function isValidPackageName(projectName) {
    return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
        projectName
    )
}

const isBinaryFile = (fileName) => {
    for (let binaryFileExtension of BINARY_FILE_EXTENSIONS) {
        if (fileName.endsWith(binaryFileExtension)) {
            return true
        }
    }
    return false
}

const getFileContentUsingFullPath = (filePath, fileName) => {
    try {
        // Read the file content synchronously
        const content = fs.readFileSync(filePath, isBinaryFile(fileName) ? 'binary': 'utf-8');
        return content;
    } catch (error) {
        throw new Error('Unable to read file: ', filePath, 'error: ', error)
    }
}

export {
    getAllFilePathsRecursively,
    renderFileWithEjs,
    writeFileWithFolderCreation,
    formatWithPrettier,
    isValidPackageName,
    makeDirectory,
    isBinaryFile,
    getFileContentUsingFullPath,
}
