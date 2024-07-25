'use strict'
import path from 'path'
import fs from 'fs'

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath)

const moduleFileExtensions = [
    // "web.mjs",
    // "mjs",
    // "web.js",
    'js',
    // "web.ts",
    // "ts",
    // "web.tsx",
    // "tsx",
    'json',
    // "web.jsx",
    'jsx',
]

const resolveModule = (resolveFn, filePath) => {
    const extension = moduleFileExtensions.find((extension) =>
        fs.existsSync(resolveFn(`${filePath}.${extension}`))
    )

    if (extension) {
        return resolveFn(`${filePath}.${extension}`)
    }

    return resolveFn(`${filePath}.js`)
}

export default {
    appPath: resolveApp('.'),
    appPackageJson: resolveModule(resolveApp, 'package'),
    appBuild: resolveApp('dist'),
    c3Config: resolveModule(resolveApp, 'c3.config'),
    appRoot: resolveApp(''),
    appSrc: resolveApp('src'),
    appNodeModules: resolveApp('node_modules'),
}
