import fs from 'fs'
import prompts from 'prompts'
import { blue, cyan, red, green } from 'kolorist'
import path from 'path'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
    runCommand,
    formatDirectoryName,
    isEmptyDirectory,
    isValidPackageName,
    toValidPackageName,
    writeContents,
    getPackageManagerDetails,
} from './util.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const FRAMEWORKS = [
    { value: 'react', title: 'React', color: blue },
    { value: 'vannila', title: 'Html', color: cyan },
]

// Get the component name from the command line arguments
let componentName = process.argv[2]
let componentDirectory = componentName
    ? formatDirectoryName(process.argv[2])
    : ''

const questions = [
    {
        type: componentName ? null : 'text',
        name: 'component',
        message: green('Enter component name'),
        onState: (state) => {
            componentDirectory = formatDirectoryName(state.value)
        },
    },
    {
        type: () =>
            !fs.existsSync(componentDirectory) ||
            isEmptyDirectory(componentDirectory)
                ? null
                : 'Choices',
        name: 'overwrite',
        message: red(
            `The directory "${componentDirectory}" already exists and is not empty. Please choose how to proceed:`
        ),
        initial: 0,
        choices: [
            {
                title: 'Remove existing files and continue',
                value: 'yes',
            },
            {
                title: 'Cancel operation',
                value: 'no',
            },
            {
                title: 'Ignore files and continue',
                value: 'ignore',
            },
        ],
    },
    {
        type: (_, { overwrite }) => {
            if (overwrite === 'no') {
                throw new Error(red('✖') + ' Operation cancelled')
            }
            return null
        },
        name: 'overwriteChecker',
    },
    {
        type: () => (isValidPackageName(componentDirectory) ? null : 'text'),
        name: 'packageName',
        message: cyan('Package name:'),
        initial: () => toValidPackageName(componentDirectory),
        validate: (dir) =>
            isValidPackageName(dir) || 'Invalid package.json name',
    },
    {
        type: 'select',
        name: 'framework',
        message: green('Select a framework:'),
        initial: 0,
        choices: FRAMEWORKS.map((framework) => {
            return {
                title: framework.color(framework.title),
                value: framework.value,
            }
        }),
    },
]

function createFolder(path) {
    runCommand(`mkdir ${path}`)
}

function copyFiles(sourcepath, targetPath) {
    runCommand(`cp -r ${sourcepath} ${targetPath}`)
}

function renameGitignore(directory) {
    if (fs.existsSync(path.normalize(`${directory}/gitignore`))) {
        fs.renameSync(
            path.normalize(`${directory}/gitignore`),
            path.normalize(`${directory}/.gitignore`)
        )
    }
}

function init() {
    prompts(questions, {
        onCancel: () => {
            console.log(red('✖') + ' Operation cancelled')
            process.exit(1)
        },
    })
        .then((response) => {
            let { packageName, framework } = response
            let target = packageName || componentDirectory

            // Update the template path to be relative to the installed package directory
            let templatePath = path.join(__dirname, `../template/${framework}/`)
            createFolder(target)
            copyFiles(templatePath, target)
            renameGitignore(target)

            const packageJson = JSON.parse(
                fs.readFileSync(path.join(target, `package.json`), 'utf-8')
            )

            packageJson.name = target

            writeContents(
                'package.json',
                target,
                JSON.stringify(packageJson, null, 2) + '\n'
            )

            let packageManagerInfo = getPackageManagerDetails(
                process.env.npm_config_user_agent
            )
            let packageManager = packageManagerInfo?.name || 'npm'

            console.log(
                green(
                    `✔ Component "${componentDirectory}" has been created.\nNow Run following commands to start development server: \n\n`
                ),
                cyan(`\tcd ${target}`)
            )

            switch (packageManager) {
                case 'yarn':
                    console.log(cyan(`\tyarn`))
                    console.log(cyan(`\tyarn dev`))
                    break
                default:
                    console.log(cyan(`\t${packageManager} install`))
                    console.log(cyan(`\t${packageManager} run dev`))
                    break
            }
            console.log(
                green(
                    `\nUse Network URL in kissflow's custom component playground for development purposes.\nFinally run the following command to generate .zip file inside dist folder: \n`
                ),
                cyan(`\t${packageManager} run build`),
                '\n'
            )
        })
        .catch((error) => {
            console.error(error)
        })
}

init()
