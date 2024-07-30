#!/usr/bin/env node

import inquirer from 'inquirer'
import * as fs from 'fs'
import chalk from 'chalk'

import { PROJECT_TARGETS } from '@shibi-snowball/custom-form-field-model'
import { FRAMEWORKS } from '../scaffolders/page/constants.js'
import { formFieldScaffolder } from '../scaffolders/form-field/index.js'
import { pageScaffolder } from '../scaffolders/page/index.js'
import { isValidPackageName, makeDirectory } from '../scaffolders/utils.js'
import { join } from 'path'

const projectName = await inquirer
    .prompt([
        {
            type: 'input',
            name: 'projectName',
            message: "Enter project's name: ",
        },
    ])
    .then(({ projectName }) => projectName.trim())

// Make sure a directory with the supplied name doesn't exist already...
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
            `Invalid project name, '${projectName}', refer https://docs.npmjs.com/cli/v10/configuring-npm/package-json.`
        )
    )
    process.exit(0)
}

const { projectTarget } = await inquirer.prompt([
    {
        type: 'list',
        name: 'projectTarget',
        message: 'What is the project categorgy? ',
        choices: Object.values(PROJECT_TARGETS),
    },
])

makeDirectory(projectFolderPath)

switch (projectTarget) {
    case PROJECT_TARGETS.FORM_FIELD: {
        formFieldScaffolder({ projectFolderPath, projectName, projectTarget })
        break
    }

    case PROJECT_TARGETS.PAGE: {
        const { framework } = await inquirer.prompt([
            {
                type: 'list',
                name: 'framework',
                message: 'Which framework do you want to use? ',
                choices: Object.values(FRAMEWORKS),
            },
        ])

        pageScaffolder({
            projectFolderPath,
            projectName,
            framework,
        })
        break
    }

    default:
        throw new Error('Invalid projectTarget... ', projectTarget)
}
