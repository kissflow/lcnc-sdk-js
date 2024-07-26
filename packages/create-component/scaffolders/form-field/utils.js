import fs from 'fs'
import path from 'path'

import ejs from 'ejs'

import * as prettier from 'prettier'

// import { prettierConf } from "./constants.js";

const readFileContentRelativeToCurrentFile = (relativePath) => {
    const currentModuleFile = new URL(import.meta.url).pathname
    const currentModuleDirectory = path.dirname(currentModuleFile)
    const absolutePath = path.resolve(currentModuleDirectory, relativePath)

    try {
        const fileContent = fs.readFileSync(absolutePath, 'utf-8')
        return fileContent
    } catch (error) {
        console.error('Error reading file:', error)
        // Handle the error as needed, e.g., throw an exception or return a default value.
    }
}

function getAllFilePathsRecursively(directoryPath) {
    const currentModuleFile = new URL(import.meta.url).pathname
    const currentModuleDirectory = path.dirname(currentModuleFile)
    const absolutePath = path.resolve(currentModuleDirectory, directoryPath)

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

    readFilesHelper(absolutePath)
    return filesList
}

const getFileContentUsingFullPath = (filePath) => {
    try {
        // Read the file content synchronously
        const content = fs.readFileSync(filePath, 'utf-8')
        return content
    } catch (error) {
        throw new Error('Unable to read file: ', filePath, 'error: ', error)
    }
}

const renderFileWithEjs = (fileContent, data) => {
    return ejs.render(fileContent, data)
}

function writeFileWithFolderCreation(targetFilePath, renderedFileContent) {
    const targetDirectory = path.dirname(targetFilePath)

    // Create the directory if it doesn't exist
    if (!fs.existsSync(targetDirectory)) {
        fs.mkdirSync(targetDirectory, { recursive: true })
    }

    // Write the file content to the target file
    fs.writeFileSync(targetFilePath, renderedFileContent, 'utf-8')
}

const formatWithPrettier = async (content, filePath) => {
    try {
        const formattedContent = await prettier.format(content, {
            filepath: filePath,
        })
        return formattedContent
    } catch (err) {
        return content
    }
}

function isValidPackageName(projectName) {
    return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
        projectName
    )
}

const makeDirectory = (projectPath) => {
    fs.mkdirSync(projectPath)
}

export {
    getAllFilePathsRecursively,
    getFileContentUsingFullPath,
    renderFileWithEjs,
    writeFileWithFolderCreation,
    formatWithPrettier,
    readFileContentRelativeToCurrentFile,
    isValidPackageName,
    makeDirectory,
}
