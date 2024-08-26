import webpack from 'webpack'
import webpackConfig from '../config/webpack.config.js'
import paths from '../paths.js'
import chokidar from 'chokidar'
import chalk from 'chalk'
import express from 'express'
import { WebSocketServer } from 'ws'
import http from 'http'
import cors from 'cors'

import { clearScreen } from '../form-field-webpack-plugin/helpers.js'
import { getSuffixedModuleMap } from '../helpers.js'

const port = 8080

const runDevBuild = () => {
    const compiler = webpack(
        Object.assign(webpackConfig, { mode: 'development' })
    )

    compiler.run((err, stats) => {})
}

const startDevServer = async () => {
    const app = express()
    app.use(cors())
    app.use(express.static(paths.appBuild)) // todo: the path needs to be changed.
    const server = http.createServer(app)
    const wss = new WebSocketServer({ server })

    app.get('/get-module-map', (req, res) => {
        res.json({
            name: 'shibi',
            lastName: 'suriya',
        })
    })

    const clients = new Set()

    wss.on('connection', (ws) => {
        clients.add(ws)
        ws.on('close', () => {
            clients.delete(ws)
        })
    })

    runDevBuild()

    server.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`)
    })

    const sourceWatcher = chokidar.watch([paths.appSrc], {
        persistent: true,
    })

    sourceWatcher.on('change', async (path) => {
        console.log('sourceWatch -> ', path)
        runDevBuild()
        for (const client of clients) {
            client.send('reload')
        }
        clearScreen()
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
