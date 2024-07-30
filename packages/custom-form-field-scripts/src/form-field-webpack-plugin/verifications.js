import path from 'path'
import {
    C3_CONFIG_SCHEMA_INVALID_ERROR,
    MANDATORY_MODULES_NOT_PRESENT_ERROR,
    REACT_DOM_VERSION_MISMATCH_ERROR,
    REACT_VERSION_MISMATCH_ERROR,
    C3_MODULE_NOT_PRESENT_ERROR,
    UNABLE_TO_PARSE_A_C3_MODULE,
    DEFAULT_EXPORT_NOT_FOUND_ERROR,
} from './errors.js'
import fs from 'fs'
import Ajv from 'ajv'
import babel from '@babel/core'
import {
    SUPPORTED_REACT_VERSION,
    SUPPORTED_REACT_DOM_VERSION,
    C3_SCHEMA,
} from '@shibi-snowball/custom-form-field-model'
import {
    getProjectTargetFromC3App,
    getAppC3Config,
    getMandatoryModules,
    getComponentsFromC3App,
} from './helpers.js'
import { getAppPackageJson } from '../helpers.js'

import paths from '../paths.js'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const performOnetimeChecks = async () => {
    // These validations are only performed ones (at instantiating time),
    // if the dev tries to change things that requires re-instantiating, for example, if he modifies the c3.config.js or package.json,
    // the build become obsolete and needs to be restarted again.
    // Add a file watcher that watchs c3.config.js and package.json of the c3-app from which this Webpack plugin is getting instantiating,
    // kill the build if changes are detecting in these files (add a log explaining why the build was killed, so that the user doesn't get
    // confused)...
    await verifyPackageVersions()
    await validateC3ConfigSchema()
    await isAllMandatoryModulesPresent()
}

const performRuntimeChecks = async () => {
    await defaultExportCheckAllModules()
}

const performPreBuildtimeChecks = async () => {
    // No need to check if package.json file exists or not, because if package.json doesn't exists the scripts that run the current file
    // can't won't be invoked.
    await getAppC3Config() // needs need to move 1 level above the compilation tree.
}

const defaultExportCheckAllModules = async () => {
    const modulesPresentInC3App = await getComponentsFromC3App()

    for (let [platforms, components] of Object.entries(modulesPresentInC3App)) {
        for (const [component, modulePath] of Object.entries(components)) {
            let hasDefaultExport = false
            let isReactComponent = false
            let code = ''

            try {
                code = fs.readFileSync(
                    path.join(paths.appRoot, modulePath),
                    'utf-8'
                )
            } catch (err) {
                throw new C3_MODULE_NOT_PRESENT_ERROR({ modulePath })
            }

            try {
                const ast = babel.parse(code, {
                    presets: [
                        require('@babel/preset-env'),
                        require('@babel/preset-react'),
                    ],
                })

                babel.traverse(ast, {
                    ExportDefaultDeclaration(path) {
                        hasDefaultExport = true
                    },
                })
            } catch (err) {
                throw new UNABLE_TO_PARSE_A_C3_MODULE({
                    component,
                    modulePath,
                    err,
                })
            }

            if (!hasDefaultExport) {
                throw new DEFAULT_EXPORT_NOT_FOUND_ERROR({
                    component,
                    modulePath,
                })
            }
        }
    }
}

const validateC3ConfigSchema = async () => {
    const ajv = new Ajv()

    const appC3Config = await getAppC3Config()
    const validate = ajv.compile(C3_SCHEMA)
    const valid = validate(appC3Config)
    if (!valid) {
        validate.errors.forEach((error) => {
            const errorMessage = ajv.errorsText([error], { separator: ', ' })
            throw new C3_CONFIG_SCHEMA_INVALID_ERROR({ errorMessage })
        })
    }
}

const verifyPackageVersions = async () => {
    // Since the react + react-dom is installed as 'dependencies'
    // all c3-apps the user might change the versions... We have to prevent this.
    const packageJson = getAppPackageJson()
    const { dependencies: deps } = packageJson

    const reactVersionUsed = deps['react']
    const reactDomVersionUsed = deps['react-dom']

    if (reactVersionUsed !== SUPPORTED_REACT_VERSION) {
        throw new REACT_VERSION_MISMATCH_ERROR({
            supportedReactVersion: SUPPORTED_REACT_VERSION,
            suppliedReactVersion: reactVersionUsed,
        })
    }
    if (reactDomVersionUsed !== SUPPORTED_REACT_DOM_VERSION) {
        throw new REACT_DOM_VERSION_MISMATCH_ERROR({
            suppliedReactDomVersion: reactDomVersionUsed,
            supportedReactDomVersion: SUPPORTED_REACT_DOM_VERSION,
        })
    }
}

const isAllMandatoryModulesPresent = async () => {
    const projectTarget = await getProjectTargetFromC3App()
    const mandatoryModules = getMandatoryModules(projectTarget)
    const modulesPresentInC3App = await getComponentsFromC3App()
    for (const [platform, components] of Object.entries(mandatoryModules)) {
        for (const component of components) {
            if (component in modulesPresentInC3App[platform]) {
                console.log(
                    `Mandatory component '${platform}/${component}' present, bundling...`
                )
            } else {
                throw new MANDATORY_MODULES_NOT_PRESENT_ERROR({
                    msg: `Mandatory module '${platform}/${component}' is not present! Exiting.`,
                })
            }
        }
    }
}

export { performRuntimeChecks, performOnetimeChecks, performPreBuildtimeChecks }
