import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import webpackConfig from '../config/webpack.config.js'
import webpackDevServerConfig from '../config/webpackDevServer.config.js'
import paths from '../paths.js'
import chokidar from 'chokidar'
import chalk from 'chalk'

const runServer = async () => {
    const compiler = webpack(
        Object.assign(webpackConfig, { mode: 'development' })
    )
    const server = new WebpackDevServer(webpackDevServerConfig, compiler)
    await server.start()
    const watcher = chokidar.watch(
        [paths.formFieldProjectConfig, paths.projectPackageJson],
        {
            persistent: true,
        }
    )

    const killServer = async () => {
        await server.stop()
        process.exit(0)
    }

    watcher
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

await runServer()
