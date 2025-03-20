import webpackConfig from '../config/webpack.config.js'
import webpack from 'webpack'
import { randomUUID } from 'crypto'

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

compiler.run((err, stats) => {})
