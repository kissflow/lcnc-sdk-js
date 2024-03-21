import { execSync } from "child_process";
import fs from "fs";

/**
 * Runs a command synchronously.
 *
 * @param {string} command - The command to be executed.
 * @returns {void}
 */
function runCommand(command) {
	execSync(command, (err, stdout, stderr) => {
		if (err) {
			console.error("command Failed" + command, err, stderr, stdout);
			return;
		}
	});
}

/**
 * Checks if a given project name is a valid package name.
 *
 * @param {string} projectName - The project name to validate.
 * @returns {boolean} - Returns true if the project name is valid, otherwise false.
 */
function isValidPackageName(projectName) {
	return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
		projectName
	);
}

/**
 * Converts a project name into a valid package name.
 *
 * @param {string} projectName - The project name to be converted.
 * @returns {string} The converted valid package name.
 */
function toValidPackageName(projectName) {
	return projectName
		.trim()
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/^[._]/, "")
		.replace(/[^a-z\d\-~]+/g, "-");
}

/**
 * Formats the directory by removing trailing slashes.
 *
 * @param {string} directoryName - The target directory to format.
 * @returns {string} The formatted target directory.
 */
function formatDirectoryName(directoryName) {
	return directoryName?.trim().replace(/\/+$/g, "");
}

/**
 * Checks if a directory is empty.
 *
 * @param {string} path - The path of the directory to check.
 * @returns {boolean} - Returns true if the directory is empty, false otherwise.
 */
function isEmptyDirectory(path) {
	const files = fs.readdirSync(path);
	return files.length === 0 || (files.length === 1 && files[0] === ".git");
}

export {
	runCommand,
	formatDirectoryName,
	isValidPackageName,
	toValidPackageName,
	isEmptyDirectory
};
