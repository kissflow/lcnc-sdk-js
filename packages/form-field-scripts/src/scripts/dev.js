import webpack from 'webpack'
import paths from '../paths.js'
import chokidar from 'chokidar'
import chalk from 'chalk'
import express from 'express'
import { WebSocketServer } from 'ws'
import http from 'http'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import https from 'https'
import { fileURLToPath } from 'url'


import remoteWebpackConfig from '../config/remote.webpack.config.js'
import hostWebpackconfig from '../config/host.webpack.config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const port = 9090

const runDevBuild = async () => {
    // 1. Runs a spa react app - **The host**.
    // 2. Builds a react based module federation remote - The Remote.
    // The host is loaded into the product using iframe.
    // The remote is then loaded into the host using module federation dynamic remotes.

    const hostBuild = new Promise((resolve, reject) => {
        const compiler = webpack(
            Object.assign(hostWebpackconfig, {
                mode: 'development',
                output: {
                    path: paths.devDist,
                },
            })
        )
        compiler.run((err, stats) => {
            console.log('run finished!')
            if (err) {
                reject(err)
            }
            resolve(stats)
        })
    })

    const remoteBuild = new Promise((resolve, reject) => {
        const compiler = webpack(
            Object.assign(remoteWebpackConfig, {
                mode: 'development',
                output: {
                    path: path.join(paths.devDist, 'custom_form_field'),
                },
            })
        )
        compiler.run((err, stats) => {
            if (err) {
                reject(err)
            }
            resolve(stats)
        })
    })

    return Promise.all([hostBuild, remoteBuild])
}

const startDevServer = async () => {
    const app = express()
    app.use(cors())
    app.use(express.static(paths.devDist))

    const options = {
        key: fs.readFileSync(path.join(__dirname, './cert/localhost.key')),
        cert: fs.readFileSync(path.join(__dirname, './cert/localhost.crt')),
    }
    const server = http.createServer(app)
    https.createServer(options, app).listen(444)

    const wss = new WebSocketServer({ server })

    const clients = new Set()

    wss.on('connection', (ws) => {
        clients.add(ws)
        ws.on('close', () => {
            clients.delete(ws)
        })
    })

    await runDevBuild()

    server.listen(port, () => {})

    const sourceWatcher = chokidar.watch([paths.appSrc], {
        persistent: true,
    })

    sourceWatcher.on('change', async (path) => {
        await runDevBuild()
        for (const client of clients) {
            client.send('reload')
        }
    })

    const killServer = async () => {
        server.close(() => {
            process.exit(0)
        })
    }

    const configWatcher = chokidar.watch(
        [paths.formFieldProjectConfig, paths.projectPackageJson],
        {
            persistent: true,
        }
    )

    configWatcher
        .on('change', async (path) => {
            console.log()
            console.log(
                chalk.bold.yellow(
                    `The file at '${path}' was modified, rendering the build obsolete. Build killed! Please rerun the build.`
                )
            )
            killServer()
        })
        .on('unlink', async (path) => {
            console.log()
            chalk.bold.yellow(
                `The file at '${path}' was removed, rendering the build obsolete. Build killed! Please rerun the build.`
            )
            killServer()
        })
        .on('error', (error) => {
            console.log(chalk.red('Error encounted in file watcher, ', error))
            killServer()
        })
}

await startDevServer()
