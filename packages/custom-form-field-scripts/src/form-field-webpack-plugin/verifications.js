import path from 'path'
import {
    FORM_FIELD_CONFIG_SCHEMA_INVALID_ERROR,
    MANDATORY_MODULES_NOT_PRESENT_ERROR,
    REACT_DOM_VERSION_MISMATCH_ERROR,
    REACT_VERSION_MISMATCH_ERROR,
    FORM_FIELD_MODULE_NOT_PRESENT_ERROR,
    UNABLE_TO_PARSE_A_FORM_FIELD_MODULE,
    DEFAULT_EXPORT_NOT_FOUND_ERROR,
} from './errors.js'
import fs from 'fs'
import Ajv from 'ajv'
import babel from '@babel/core'
import {
    SUPPORTED_REACT_VERSION,
    SUPPORTED_REACT_DOM_VERSION,
    FORM_FIELD_PROJECT_CONFIG_SCHEMA,
} from '@shibi-snowball/custom-form-field-model'
import {
    getProjectTargetFromFormFieldProject,
    getMandatoryModules,
    getComponentsFromFormFieldProject,
} from './helpers.js'

import { getFormFieldProjectConfig } from '../helpers.js'
import { getAppPackageJson } from '../helpers.js'

import paths from '../paths.js'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const performOnetimeChecks = async () => {
    // These validations are only performed ones (at instantiating time),
    // if the dev tries to change things that requires re-instantiating, for example, if he modifies the form-field.config.js or package.json,
    // the build become obsolete and needs to be restarted again.
    // Add a file watcher that watch the form-field.config.js and package.json of the custom form field project from which this Webpack plugin is getting instantiating,
    // kill the build if changes are detecting in these files (add a log explaining why the build was killed, so that the user doesn't get
    // confused)...
    await verifyPackageVersions()
    await validateFormFieldProjectConfigSchema()
    await isAllMandatoryModulesPresent()
}

const performRuntimeChecks = async () => {
    await defaultExportCheckAllModules()
}

const performPreBuildtimeChecks = async () => {
    // No need to check if package.json file exists or not, because if package.json doesn't exists the scripts that run the current file
    // can't won't be invoked.
    await getFormFieldProjectConfig() // needs need to move 1 level above the compilation tree.
}

const defaultExportCheckAllModules = async () => {
    const modulesPresentInFormFieldProject =
        await getComponentsFromFormFieldProject()

    for (let [platforms, components] of Object.entries(
        modulesPresentInFormFieldProject
    )) {
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
                throw new FORM_FIELD_MODULE_NOT_PRESENT_ERROR({ modulePath })
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
                throw new UNABLE_TO_PARSE_A_FORM_FIELD_MODULE({
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

const validateFormFieldProjectConfigSchema = async () => {
    const ajv = new Ajv()

    const formFieldProjectConfig = await getFormFieldProjectConfig()
    const validate = ajv.compile(FORM_FIELD_PROJECT_CONFIG_SCHEMA)
    const valid = validate(formFieldProjectConfig)
    if (!valid) {
        validate.errors.forEach((error) => {
            const errorMessage = ajv.errorsText([error], { separator: ', ' })
            throw new FORM_FIELD_CONFIG_SCHEMA_INVALID_ERROR({ errorMessage })
        })
    }
}

const verifyPackageVersions = async () => {
    // Since the react + react-dom is installed as 'dependencies'
    // The user might change the versions... We have to prevent this.
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
    const projectTarget = await getProjectTargetFromFormFieldProject()
    const mandatoryModules = getMandatoryModules(projectTarget)
    const modulesPresentInFormFieldProject =
        await getComponentsFromFormFieldProject()
    for (const [platform, components] of Object.entries(mandatoryModules)) {
        for (const component of components) {
            if (!(component in modulesPresentInFormFieldProject[platform])) {
                throw new MANDATORY_MODULES_NOT_PRESENT_ERROR({
                    msg: `Mandatory module '${platform}/${component}' is not present!`,
                })
            }
        }
    }
}

export { performRuntimeChecks, performOnetimeChecks, performPreBuildtimeChecks }
