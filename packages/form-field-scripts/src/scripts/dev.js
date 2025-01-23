process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

import webpack from 'webpack'
import webpackConfig from '../config/webpack.config.js'
import paths from '../paths.js'
import chokidar from 'chokidar'
import chalk from 'chalk'
import express from 'express'
import { WebSocketServer } from 'ws'
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

const PORT = 9090

const cdn = { url: '' }

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
        if (
            req.path.startsWith('/customcomponent/formfield') ||
            req.path.startsWith('/custom_form_field')
        ) {
            return next()
        }

        const url =
            cdn.url && cdn.url != '/'
                ? `https:${cdn.url}${req.path.replace(/^\/+/, '')}`
                : `https://localhost${req.path}`

        const agent = new https.Agent({
            rejectUnauthorized: false, // Ignore self-signed certificates
        })

        try {
            const externalResponse = await fetch(url, { agent })
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
            secure: false,
            changeOrigin: true,
            selfHandleResponse: true,
            router: (req) => {
                const publicPath = req.query['publicPath']
                const origin = req.query['origin']
                cdn.url = publicPath

                const path = 'customcomponent/formfield'

                if (!origin || origin == 'https://dev.localhost') {
                    // The request has been made from
                    // localhost (kf-xg-frontend)...
                    // I am unable to proxy https://dev.localhost
                    // for some reason... Currently, I am unble
                    // pinpoint where the issue is... Is it in
                    // nodejs? Or http-proxy-server or http?
                    return `https://localhost/${path}`
                }

                return `${origin}/${path}`
            },
            on: {
                proxyRes: responseInterceptor(
                    async (responseBuffer, proxyRes, req, res) => {
                        const response = responseBuffer.toString('utf8')
                        res.removeHeader('content-security-policy')

                        if (cdn.url && cdn.url != '/') {
                            return response.replaceAll(
                                cdn.url,
                                `//127.0.0.1:${PORT}/`
                            )
                        }

                        return response
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
    const server = https.createServer(options, app).listen(PORT)
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
