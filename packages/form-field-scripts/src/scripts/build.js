import webpackConfig from '../config/webpack.config.js'
import webpack from 'webpack'

const compiler = webpack(webpackConfig)

compiler.run((err, stats) => {
    console.log('build finised')
})
