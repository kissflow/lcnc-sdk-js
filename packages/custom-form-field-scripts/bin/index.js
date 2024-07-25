#!/usr/bin/env node

import { program } from 'commander'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import chalk from 'chalk'
import { logBoxenError } from '../src/logBoxen.js'
import { performPreBuildtimeChecks } from '../src/c3-webpack-plugin/verifications.js'

program
    .command('dev')
    .description('Serve the project.')
    .action(() => {
        console.log('Serving the project for local development...')
        runScript('dev.js')
    })

program
    .command('build')
    .description('Build the project.')
    .action(async () => {
        console.log('Building the project...')
        runScript('build.js')
    })

async function runScript(script) {
    try {
        await performPreBuildtimeChecks()
    } catch (error) {
        const { title, description } = error
        logBoxenError({ title, description })
        process.exit(0)
    }

    try {
        const __filename = fileURLToPath(import.meta.url)
        const __dirname = dirname(__filename)
        const scriptPath = resolve(__dirname, '../src/scripts/', script)
        execSync(`node ${scriptPath}`, {
            stdio: 'inherit',
        })
    } catch (error) {
        console.log(chalk.bold.red('Unable to run script, ', error))
    }
}

program.parse(process.argv)
