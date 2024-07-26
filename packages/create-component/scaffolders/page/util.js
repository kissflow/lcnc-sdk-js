import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

/**
 * Runs a command synchronously.
 *
 * @param {string} command - The command to be executed.
 * @returns {void}
 */
export function runCommand(command) {
    execSync(command, (err, stdout, stderr) => {
        if (err) {
            console.error('command Failed' + command, err, stderr, stdout)
            return
        }
    })
}

/**
 * Checks if a given project name is a valid package name.
 *
 * @param {string} projectName - The project name to validate.
 * @returns {boolean} - Returns true if the project name is valid, otherwise false.
 */
export function isValidPackageName(projectName) {
    return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
        projectName
    )
}

/**
 * Converts a project name into a valid package name.
 *
 * @param {string} projectName - The project name to be converted.
 * @returns {string} The converted valid package name.
 */
export function toValidPackageName(projectName) {
    return projectName
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/^[._]/, '')
        .replace(/[^a-z\d\-~]+/g, '-')
}

/**
 * Formats the directory by removing trailing slashes.
 *
 * @param {string} directoryName - The target directory to format.
 * @returns {string} The formatted target directory.
 */
export function formatDirectoryName(directoryName) {
    return directoryName?.trim().replace(/\/+$/g, '')
}

/**
 * Checks if a directory is empty.
 *
 * @param {string} path - The path of the directory to check.
 * @returns {boolean} - Returns true if the directory is empty, false otherwise.
 */
export function isEmptyDirectory(path) {
    const files = fs.readdirSync(path)
    return files.length === 0 || (files.length === 1 && files[0] === '.git')
}

/**
 * Writes content to a file at the specified path.
 *
 * @param {string} file - The name of the file to write.
 * @param {string} root - The root directory where the file should be written.
 * @param {string} content - The content to write to the file.
 */
export function writeContents(file, root, content) {
    const targetPath = path.join(root, file)
    if (content) {
        fs.writeFileSync(targetPath, content)
    }
}

/**
 * Extracts package manager details from the user agent string.
 *
 * @param {string} userAgent - The user agent string.
 * @returns {object|undefined} - Returns an object containing the package manager name and version, or undefined if the user agent is not provided.
 */
export function getPackageManagerDetails(userAgent) {
    if (!userAgent) return undefined
    const packageManager = userAgent.split(' ')[0]
    const nameWithVersion = packageManager.split('/')
    return {
        name: nameWithVersion[0],
        version: nameWithVersion[1],
    }
}
