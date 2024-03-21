#!/usr/bin/env node

import { execSync } from "node:child_process";

function runCommand(command) {
	execSync(command, (err, stdout, stderr) => {
		if (err) {
			console.error("command Failed" + command, err, stderr, stdout);
			return;
		}
	});
}

// Get the component name from the command line arguments
let componentName = process.argv[2] || "test";
let framework = process.argv[3] || "react";

// Check if the component name is provided
console.info("Creating a new component...", componentName);
if (!componentName) {
	console.error("Please provide a component name.");
	process.exit(1);
}

function createFolder(path) {
	runCommand(`mkdir ${path}`);
}

function copyFiles(sourcepath, targetPath) {
	runCommand(`cp -r ${sourcepath} ${targetPath}`);
}

let destinationPath = `./kf-${componentName}`;
let currentDirectory = process.cwd();
let templatePath = `${currentDirectory}/template/${framework}-template/`;
createFolder(destinationPath);
copyFiles(templatePath, destinationPath);

console.log(`Component "${componentName}" created successfully at`);
