import webpackConfig from '../config/webpack.config.js'
import webpack from 'webpack'

const compiler = webpack(Object.assign(webpackConfig, { mode: 'production' }))

compiler.run((err, stats) => {})
