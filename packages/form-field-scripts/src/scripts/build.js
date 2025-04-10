import webpackConfig from '../config/webpack.config.js'
import webpack from 'webpack'
import { randomUUID } from 'crypto'
import { removeDirectory } from '../helpers.js'
import paths from '../paths.js'

export function build() {
    const compiler = webpack(
        Object.assign(webpackConfig, {
            mode: 'production',
            output: { uniqueName: '_' + randomUUID() }, // this is done
            // inorder to prevent collision between builds... Since
            // usage of custom form fields are going to be very low
            // and 'crypto' is a good native lib, I have decided
            // to implement this...
        })
    )

    return new Promise((resolve) => {
        compiler.run((err, stats) => {
            resolve()
        })
    })
}

removeDirectory(paths.appBuild) // Remove the previous /dist directory if present...

await build()
