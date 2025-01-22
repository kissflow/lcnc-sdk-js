import webpack from 'webpack'
import webpackConfig from '../config/webpack.config.js'
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
import {
    createProxyMiddleware,
    responseInterceptor,
} from 'http-proxy-middleware'
import { Readable } from 'stream'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const port = 9090

const runDevBuild = async () => {
    return new Promise((resolve, reject) => {
        const compiler = webpack(
            Object.assign(webpackConfig, {
                mode: 'development',
                output: {
                    path: paths.devDist,
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
}

const startDevServer = async () => {
    const app = express()
    app.use(cors())

    app.use(async (req, res, next) => {
        console.log('suriya -> ', req.path)
        if (
            req.path.startsWith('/customcomponent/formfield') ||
            req.path.startsWith('/custom_form_field')
        ) {
            console.log('shibi -> ', req.path)
            return next()
        }

        const url = `https://pegasicdn2.zingworks.com${req.path}`

        try {
            const externalResponse = await fetch(url)
            if (!externalResponse.ok) {
                return res
                    .status(externalResponse.status)
                    .send(`Error: ${externalResponse.statusText}`)
            }

            // Pass the content-type and file as response
            const contentType = externalResponse.headers.get('content-type')
            res.set('content-type', contentType)

            // Convert the body to a readable stream and pipe it to the response
            Readable.from(externalResponse.body).pipe(res)
        } catch (error) {
            console.error(`Error fetching URL: ${error.message}`)
            res.status(500).send('Internal Server Error')
        }
    })

    app.use(
        '/customcomponent/formfield',
        createProxyMiddleware({
            target: 'https://development-platform-extension.fecqa.zingworks.com/customcomponent/formfield',
            changeOrigin: true,
            selfHandleResponse: true, // res.end() will be called internally by responseInterceptor()
            on: {
                proxyRes: responseInterceptor(
                    async (responseBuffer, proxyRes, req, res) => {
                        const response = responseBuffer.toString('utf8')
                        res.removeHeader('content-security-policy')
                        return response.replaceAll(
                            'pegasicdn2.zingworks.com',
                            `127.0.0.1:${port}`
                        )
                    }
                ),
            },
        })
    )

    app.use('/custom_form_field', express.static(paths.devDist))

    const options = {
        key: fs.readFileSync(path.join(__dirname, './cert/private.key')),
        cert: fs.readFileSync(path.join(__dirname, './cert/certificate.crt')),
    }
    const server = http.createServer(app)
    https.createServer(options, app).listen(port)

    const wss = new WebSocketServer({ server })

    const clients = new Set()

    wss.on('connection', (ws) => {
        clients.add(ws)
        ws.on('close', () => {
            clients.delete(ws)
        })
    })

    await runDevBuild()

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
