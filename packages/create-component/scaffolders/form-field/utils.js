import fs from 'fs'
import path from 'path'
import latestVersion from 'latest-version'

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

const getFileContentUsingFullPath = (filePath) => {
    try {
        // Read the file content synchronously
        const content = fs.readFileSync(filePath, 'utf-8')
        return content
    } catch (error) {
        throw new Error('Unable to read file: ', filePath, 'error: ', error)
    }
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

export {
    getFileContentUsingFullPath,
    readFileContentRelativeToCurrentFile,
    getLatestPackageVersion,
}
