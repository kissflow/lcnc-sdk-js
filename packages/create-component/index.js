#!/usr/bin/env node
import fs from "fs";
import prompts from "prompts";
import { blue, cyan, red, reset, green } from "kolorist";

import {
	runCommand,
	formatDirectoryName,
	isEmptyDirectory,
	isValidPackageName,
	toValidPackageName
} from "./helpers/index.js";

const FRAMEWORKS = [
	{ value: "react", title: "React", color: blue },
	{ value: "html", title: "Html", color: cyan }
];

// Get the component name from the command line arguments
let componentName = process.argv[2];
let componentDirectory = componentName
	? formatDirectoryName(process.argv[2])
	: "";
let currentDirectory = process.cwd();

const questions = [
	{
		type: componentName ? null : "text",
		name: "component",
		message: green("Enter component name"),
		onState: (state) => {
			componentDirectory = formatDirectoryName(state.value);
		}
	},
	{
		type: () =>
			!fs.existsSync(componentDirectory) ||
			isEmptyDirectory(componentDirectory)
				? null
				: "Choices",
		name: "overwrite",
		message: red(
			`The directory "${componentDirectory}" already exists and is not empty. Please choose how to proceed:`
		),
		initial: 0,
		choices: [
			{
				title: "Remove existing files and continue",
				value: "yes"
			},
			{
				title: "Cancel operation",
				value: "no"
			},
			{
				title: "Ignore files and continue",
				value: "ignore"
			}
		]
	},
	{
		type: (_, { overwrite }) => {
			if (overwrite === "no") {
				throw new Error(red("✖") + " Operation cancelled");
			}
			return null;
		},
		name: "overwriteChecker"
	},
	{
		type: () => (isValidPackageName(componentDirectory) ? null : "text"),
		name: "packageName",
		message: reset("Package name:"),
		initial: () => toValidPackageName(componentDirectory),
		validate: (dir) =>
			isValidPackageName(dir) || "Invalid package.json name"
	},
	{
		type: "select",
		name: "framework",
		message: reset("Select a framework:"),
		initial: 0,
		choices: FRAMEWORKS.map((framework) => {
			return {
				title: framework.color(framework.title),
				value: framework.value
			};
		})
	}
];

function createFolder(path) {
	runCommand(`mkdir ${path}`);
}

function copyFiles(sourcepath, targetPath) {
	runCommand(`cp -r ${sourcepath} ${targetPath}`);
}

function init() {
	prompts(questions, {
		onCancel: () => {
			console.log(red("✖") + " Operation cancelled");
			process.exit(1);
		}
	})
		.then((response) => {
			let { packageName, framework } = response;
			let target = packageName || componentDirectory;

			console.info("Creating component...", target);

			let templatePath = `${currentDirectory}/template/${framework}-template/`;
			createFolder(target);
			copyFiles(templatePath, target);

			console.log(
				green(
					`✔ Component "${componentDirectory}" created successfully`
				)
			);
		})
		.catch((error) => {
			console.error(error);
		});
}

init();
