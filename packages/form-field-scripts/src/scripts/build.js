import webpackConfig from '../config/webpack.config.js'
import webpack from 'webpack'

const compiler = webpack(Object.assign(webpackConfig, { mode: 'production' }))

compiler.run((err, stats) => {
    if (!err) {
        console.log(`
            Build is complete. To use this custom component, upload the ZIP file in the Import component page and publish it.
        `)
    }
})
