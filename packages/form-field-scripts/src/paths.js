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
    'jsx'
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
    buildCache: resolveApp('node_modules/build_cache'),
    appPath: resolveApp('.'),
    projectPackageJson: resolveModule(resolveApp, 'package'),
    appBuild: resolveApp('dist'),
    formFieldProjectConfig: resolveModule(resolveApp, 'form-field.config'),
    appRoot: resolveApp(''),
    appSrc: resolveApp('src'),
    appNodeModules: resolveApp('node_modules'),
    devDist: resolveApp('node_modules/dev_dist'),
    eslintCache: resolveApp('node_modules/.cache/.eslintcache')
}
