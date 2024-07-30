class C3_ERROR {
    constructor({ title, description }) {
        this.title = title
        this.description = description
    }
}

class C3_MODULE_NOT_PRESENT_ERROR extends C3_ERROR {
    constructor({ modulePath }) {
        super({
            title: 'Module not present',
            description: `The module at '${modulePath}' not present.`,
        })
    }
}

class REACT_VERSION_MISMATCH_ERROR extends C3_ERROR {
    constructor({ supportedReactVersion, suppliedReactVersion }) {
        const title = `React version mismatch!`
        const description = `react version ${supportedReactVersion} expected, react version ${suppliedReactVersion} supplied, please update app's package.json and rerun the build.`
        super({ title, description })
    }
}

class REACT_DOM_VERSION_MISMATCH_ERROR extends C3_ERROR {
    constructor({ supportedReactDomVersion, suppliedReactDomVersion }) {
        const title = `React version mismatch!`
        const description = `react-dom version ${supportedReactDomVersion} expected, react-dom version ${suppliedReactDomVersion} supplied, please update app's package.json and rerun the build.`
        super({ title, description })
    }
}

class C3_CONFIG_SCHEMA_INVALID_ERROR extends C3_ERROR {
    constructor({ errorMessage }) {
        super({
            title: "c3.config.js doesn't follow the schema!",
            description: errorMessage,
        })
    }
}

class DEFAULT_EXPORT_NOT_FOUND_ERROR extends C3_ERROR {
    constructor({ modulePath, component }) {
        super({
            title: 'Default export not found in a C3 module',
            description: `Default export not found at '${modulePath}', the module must default export the code for ${component} component.`,
        })
        this.modulePath = modulePath
    }
}

class DEFAULT_EXPORT_NOT_REACT_COMPONENT_ERROR extends C3_ERROR {
    constructor() {
        super()
    }
}

class MANDATORY_MODULES_NOT_PRESENT_ERROR extends C3_ERROR {
    constructor({ msg }) {
        super({ title: 'Mandatory module not present!', description: msg })
    }
}

class UNABLE_TO_PARSE_A_C3_MODULE extends C3_ERROR {
    constructor({ component, modulePath, err }) {
        super({
            title: 'Unable to parse module using babel',
            description: `Unable to parse the module '${modulePath} using babel.'`,
        })
    }
}

class C3_CONFIG_NOT_FOUND extends C3_ERROR {
    constructor() {
        super({
            title: '`c3.config.js` not found',
            description:
                'All c3-apps must have a configuration file named `c3.config.js` in its root.',
        })
    }
}

class UNABLE_TO_PARSE_C3_CONFIG extends C3_ERROR {
    constructor() {
        super({
            title: 'Unable to parse c3.config.js',
            description:
                'Unable to parse `c3.config.js`, the module might contain syntax errors.',
        })
    }
}

export {
    UNABLE_TO_PARSE_C3_CONFIG,
    C3_CONFIG_NOT_FOUND,
    MANDATORY_MODULES_NOT_PRESENT_ERROR,
    DEFAULT_EXPORT_NOT_FOUND_ERROR,
    REACT_VERSION_MISMATCH_ERROR,
    REACT_DOM_VERSION_MISMATCH_ERROR,
    C3_CONFIG_SCHEMA_INVALID_ERROR,
    DEFAULT_EXPORT_NOT_REACT_COMPONENT_ERROR,
    C3_MODULE_NOT_PRESENT_ERROR,
    UNABLE_TO_PARSE_A_C3_MODULE,
    C3_ERROR,
}
