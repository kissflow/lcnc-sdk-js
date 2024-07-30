class FORM_FIELD_ERROR {
    constructor({ title, description }) {
        this.title = title
        this.description = description
    }
}

class FORM_FIELD_MODULE_NOT_PRESENT_ERROR extends FORM_FIELD_ERROR {
    constructor({ modulePath }) {
        super({
            title: 'Module not present',
            description: `The module at '${modulePath}' is not present.`,
        })
    }
}

class REACT_VERSION_MISMATCH_ERROR extends FORM_FIELD_ERROR {
    constructor({ supportedReactVersion, suppliedReactVersion }) {
        const title = `React version mismatch!`
        const description = `The expected React version is ${supportedReactVersion}, but version ${suppliedReactVersion} was provided. Please update the React version in your project's package.json file to ${supportedReactVersion} and rerun the build.`
        super({ title, description })
    }
}

class REACT_DOM_VERSION_MISMATCH_ERROR extends FORM_FIELD_ERROR {
    constructor({ supportedReactDomVersion, suppliedReactDomVersion }) {
        const title = `ReactDOM version mismatch!`
        const description = `The expected ReactDOM version is ${supportedReactDomVersion}, but version ${suppliedReactDomVersion} was provided. Please update the ReactDOM version in your project's package.json file to ${supportedReactDOMVersion} and rerun the build.`
        super({ title, description })
    }
}

class FORM_FIELD_CONFIG_SCHEMA_INVALID_ERROR extends FORM_FIELD_ERROR {
    constructor({ errorMessage }) {
        super({
            title: "form-field.config.js doesn't follow the API schema.",
            description: errorMessage,
        })
    }
}

class DEFAULT_EXPORT_NOT_FOUND_ERROR extends FORM_FIELD_ERROR {
    constructor({ modulePath, component }) {
        super({
            title: 'Default export not found in a form field module',
            description: `Default export not found in the Javascript module '${modulePath}', the module must default export a React component for Kissflow form's '${component}'.`,
        })
        this.modulePath = modulePath
    }
}

class DEFAULT_EXPORT_NOT_REACT_COMPONENT_ERROR extends FORM_FIELD_ERROR {
    // todo: Shibi
    constructor() {
        super()
    }
}

class MANDATORY_MODULES_NOT_PRESENT_ERROR extends FORM_FIELD_ERROR {
    constructor({ msg }) {
        super({ title: 'Mandatory module not present!', description: msg })
    }
}

class UNABLE_TO_PARSE_A_FORM_FIELD_MODULE extends FORM_FIELD_ERROR {
    constructor({ component, modulePath, err }) {
        super({
            title: 'Unable to parse module using babel',
            description: `Unable to parse the module '${modulePath} using babel.'`,
        })
    }
}

class FORM_FIELD_CONFIG_NOT_FOUND extends FORM_FIELD_ERROR {
    constructor() {
        super({
            title: '`form-field.config.js` not found',
            description:
                'All custom form field projects must include a configuration file named form-field.config.js in their root directory.',
        })
    }
}

class UNABLE_TO_PARSE_FORM_FIELD_CONFIG extends FORM_FIELD_ERROR {
    constructor() {
        super({
            title: 'Unable to parse form-field.config.js',
            description:
                'Unable to parse `form-field.config.js` due to syntax error(s) present in the module.',
        })
    }
}

export {
    UNABLE_TO_PARSE_FORM_FIELD_CONFIG,
    FORM_FIELD_CONFIG_NOT_FOUND,
    MANDATORY_MODULES_NOT_PRESENT_ERROR,
    DEFAULT_EXPORT_NOT_FOUND_ERROR,
    REACT_VERSION_MISMATCH_ERROR,
    REACT_DOM_VERSION_MISMATCH_ERROR,
    FORM_FIELD_CONFIG_SCHEMA_INVALID_ERROR,
    DEFAULT_EXPORT_NOT_REACT_COMPONENT_ERROR,
    FORM_FIELD_MODULE_NOT_PRESENT_ERROR,
    UNABLE_TO_PARSE_A_FORM_FIELD_MODULE,
    FORM_FIELD_ERROR,
}
