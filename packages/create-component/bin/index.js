#!/usr/bin/env node

import { program } from 'commander'
import inquirer from 'inquirer'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import * as fs from 'fs'
import chalk from 'chalk'

import { PROJECT_TARGETS } from '@shibi-snowball/c3-model'
import { formFieldScaffolder } from '../scaffolders/form-field/index.js'
import { pageScaffolder } from '../scaffolders/page/index.js'
import { isValidPackageName, makeDirectory } from '../template/utils.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const packageJsonPath = join(__dirname, '../package.json')
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
const availableStarterKits = []

program
    .version(packageJson.version)
    .description('A Node.js based cli tool to scaffold a @kissflow/c3 app.')

program
    .arguments('[project-name]')
    .option(
        '--project-target <project-target>', // If <> is used commander.js expects a mandatory option.
        `Specify the project's target (${Object.values(PROJECT_TARGETS).reduce(
            (options, projectTarget, index) => {
                options += projectTarget
                if (index !== Object.keys(PROJECT_TARGETS).length - 1) {
                    options += '|'
                }
                return options
            },
            ''
        )})`
    )
    .option('--starter-kit [starter-kit]', 'Choose a starter kit to use.') // If [] is used command.js expects an optional option.
    .action(async (projectName, options) => {
        let { starterKit, projectTarget } = options
        projectName = projectName?.trim()
        projectTarget = projectTarget?.trim()
        starterKit = starterKit?.trim()
        if (starterKit && projectTarget) {
            // These two are contradicting options, so they should not be used together...
            console.log(
                chalk.red(
                    "Error: --starter-kit and --project-target can't be used together. A starter kit already knows what it is targeting."
                )
            )
            process.exit(0)
        }

        const validC3Targets = Object.values(PROJECT_TARGETS)
        if (projectTarget && !validC3Targets.includes(projectTarget)) {
            console.log(
                chalk.red(`Invalid project target '${projectTarget}' supplied.`)
            )
            process.exit(0)
        }

        // The cli can be used by directly passing in command line arguments or in interactive mode...
        if (!projectName) {
            const questions = [
                {
                    type: 'input',
                    name: 'projectName',
                    message: "Enter new c3-app's name: ",
                },
            ]

            const answers = await inquirer.prompt(questions)
            projectName = answers.projectName.trim()
        }

        if (starterKit === true) {
            // The user has used the option but didn't supply a starter kit template name...
            // Show him a list of available starter kits and let him select from it...
        } else if (starterKit) {
            // The user has supplied a starter kit's name, make sure wheather it is present
            // in the cli or not...
            if (availableStarterKits.includes(starterKit)) {
            } else {
                console.log(
                    chalk.red(
                        "Error: The started kit that you asked for doesn't exists..."
                    )
                )
                console.log(
                    chalk.red('The following starter kits are supported, ')
                )
                console.log(chalk.red(availableStarterKits))
                process.exit(0)
            }
        }

        if (!projectTarget) {
            const projectTypes = Object.values(PROJECT_TARGETS)
            const questions = [
                {
                    type: 'list', // Change type to "list"
                    name: 'projectTarget',
                    message: "Select c3-app's target : ",
                    choices: projectTypes,
                },
            ]

            const answers = await inquirer.prompt(questions)
            projectTarget = answers.projectTarget
        }

        // Make sure a directory with the name supplied name doesn't exists...
        const currentWorkingDirectory = process.cwd() // This is the directory from which the script was invoked.
        const projectFolderPath = join(currentWorkingDirectory, projectName)
        if (fs.existsSync(projectFolderPath)) {
            console.log(
                chalk.red(
                    `Error: A directory with the name '${projectName}' already exists in ${currentWorkingDirectory}!
                     Please, either, 
                     1) Supply a new project name.
                     2) Remove or rename the existing folder.`
                )
            )
            process.exit(0)
        } else if (!isValidPackageName(projectName)) {
            console.log(
                chalk.red(
                    `Invalid c3-app name, '${projectName}', refer https://docs.npmjs.com/cli/v10/configuring-npm/package-json.`
                )
            )
            process.exit(0)
        } else {
            makeDirectory(projectFolderPath)
            switch (projectTarget) {
                case PROJECT_TARGETS.FORM_FIELD: {
                    formFieldScaffolder(
                        projectFolderPath,
                        projectName,
                        projectTarget
                    )
                    break
                }
                case PROJECT_TARGETS.PAGE: {
                    pageScaffolder({
                        projectFolderPath,
                        projectName,
                        framework: 'react',
                    })
                    break
                }
                default:
                    throw new Error('Unknown projectTarget... ', projectTarget)
            }
        }
    })

program.parse(process.argv)
